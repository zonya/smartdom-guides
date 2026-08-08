#!/usr/bin/env python3
"""
Vođenje Home Assistant-a kroz Chrome DevTools Protocol.

Radi dve stvari odjednom:
  - snima pojedinačne slike za tekstove (`shot`)
  - snima kadrove za video (`Page.startScreencast`), koje ffmpeg posle spaja

Zašto CDP a ne `--screenshot`: `--screenshot` ume samo da otvori stranicu i
slika je. Za HA nam treba klik, kucanje i čekanje da se HA doda (HA je SPA, pa
se URL ne menja uvek), a to traži živu sesiju.

Koristi se kao biblioteka — vidi skripte scenarija pored.
"""

import asyncio
import base64
import json
import os
import shutil
import signal
import subprocess
import time
from pathlib import Path

import websockets
import urllib.request

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


class Chrome:
    def __init__(self, out_dir, width=1440, height=900, port=9222, scale=2):
        self.out = Path(out_dir)
        self.out.mkdir(parents=True, exist_ok=True)
        self.frames_dir = self.out / "_frames"
        self.width, self.height, self.port = width, height, port
        # scale=2 daje retina oštrinu; slike se posle smanje na pola.
        self.scale = scale
        self.proc = None
        self.ws = None
        self._id = 0
        self.shot_no = 0
        self.frame_no = 0
        self.recording = False
        self._pump = None

    # ---------- životni ciklus ----------

    async def start(self):
        profile = self.out / "_profile"
        if profile.exists():
            shutil.rmtree(profile)
        self.proc = subprocess.Popen(
            [
                CHROME,
                "--headless=new",
                "--disable-gpu",
                "--hide-scrollbars",
                f"--remote-debugging-port={self.port}",
                f"--window-size={self.width},{self.height}",
                f"--force-device-scale-factor={self.scale}",
                f"--user-data-dir={profile}",
                "--no-first-run",
                "--no-default-browser-check",
                "about:blank",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        url = None
        for _ in range(60):
            try:
                data = json.loads(
                    urllib.request.urlopen(
                        f"http://127.0.0.1:{self.port}/json/list", timeout=1
                    ).read()
                )
                pages = [t for t in data if t["type"] == "page"]
                if pages:
                    url = pages[0]["webSocketDebuggerUrl"]
                    break
            except Exception:
                pass
            await asyncio.sleep(0.5)
        if not url:
            raise RuntimeError("Chrome se nije javio na CDP portu")
        self.ws = await websockets.connect(url, max_size=64 * 1024 * 1024)
        await self.send("Page.enable")
        await self.send("Runtime.enable")
        await self.send("DOM.enable")

    async def stop(self):
        if self.recording:
            await self.stop_recording()
        if self.ws:
            await self.ws.close()
        if self.proc:
            self.proc.send_signal(signal.SIGTERM)
            try:
                self.proc.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self.proc.kill()

    # ---------- CDP ----------

    async def send(self, method, **params):
        try:
            return await self._send_once(method, params)
        except Exception as e:
            # Klik ume da otvori/zameni target, pa sesija otpadne. Kačimo se
            # ponovo na tekuću stranicu i pokušavamo jednom više — bez ovoga
            # ceo prolaz pada zbog jednog dugmeta.
            if "Not attached" in str(e) or "closed" in str(e).lower():
                print("  … sesija otpala, kačim se ponovo")
                await self._reconnect()
                return await self._send_once(method, params)
            raise

    async def _send_once(self, method, params):
        self._id += 1
        mid = self._id
        await self.ws.send(json.dumps({"id": mid, "method": method, "params": params}))
        while True:
            msg = json.loads(await self.ws.recv())
            if msg.get("id") == mid:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})
            await self._handle_event(msg)

    async def _reconnect(self):
        try:
            await self.ws.close()
        except Exception:
            pass
        url = None
        for _ in range(20):
            data = json.loads(
                urllib.request.urlopen(
                    f"http://127.0.0.1:{self.port}/json/list", timeout=2
                ).read()
            )
            pages = [t for t in data if t["type"] == "page" and t.get("url")]
            if pages:
                url = pages[0]["webSocketDebuggerUrl"]
                break
            await asyncio.sleep(0.5)
        if not url:
            raise RuntimeError("nema aktivne stranice za ponovno kačenje")
        self.ws = await websockets.connect(url, max_size=64 * 1024 * 1024)
        self._id = 0
        for m in ("Page.enable", "Runtime.enable", "DOM.enable"):
            await self._send_once(m, {})
        if self.recording:
            await self._send_once(
                "Page.startScreencast",
                dict(format="jpeg", quality=85, maxWidth=self.width,
                     maxHeight=self.height, everyNthFrame=1),
            )

    async def _handle_event(self, msg):
        if msg.get("method") == "Page.screencastFrame":
            p = msg["params"]
            self.frame_no += 1
            (self.frames_dir / f"f{self.frame_no:06d}.jpg").write_bytes(
                base64.b64decode(p["data"])
            )
            try:
                await self.ws.send(
                    json.dumps(
                        {
                            "id": 10_000_000 + self.frame_no,
                            "method": "Page.screencastFrameAck",
                            "params": {"sessionId": p["sessionId"]},
                        }
                    )
                )
            except Exception:
                pass

    # ---------- radnje ----------

    async def goto(self, url, wait=3.0):
        await self.send("Page.navigate", url=url)
        await self.settle(wait)

    async def settle(self, seconds=1.5):
        """Čeka, ali nastavlja da prima kadrove dok čeka."""
        end = time.monotonic() + seconds
        while time.monotonic() < end:
            try:
                msg = await asyncio.wait_for(self.ws.recv(), timeout=0.2)
                await self._handle_event(json.loads(msg))
            except asyncio.TimeoutError:
                pass

    async def js(self, expression, await_promise=False):
        r = await self.send(
            "Runtime.evaluate",
            expression=expression,
            returnByValue=True,
            awaitPromise=await_promise,
        )
        if "exceptionDetails" in r:
            raise RuntimeError(r["exceptionDetails"].get("text", "JS greška"))
        return r.get("result", {}).get("value")

    async def shot(self, name, wait=1.0):
        """Snimi sliku za tekst. Ime dobija redni broj radi sortiranja."""
        await self.settle(wait)
        self.shot_no += 1
        r = await self.send("Page.captureScreenshot", format="png")
        path = self.out / f"{self.shot_no:02d}-{name}.png"
        path.write_bytes(base64.b64decode(r["data"]))
        print(f"  slika: {path.name}")
        return path

    # ---------- traženje elemenata ----------
    #
    # HA je Web Components aplikacija: skoro sve je unutar shadow DOM-a, pa
    # `document.querySelector` ne vidi ništa korisno. Zato se stablo obilazi
    # ručno, ulazeći u svaki `shadowRoot`.

    DEEP = """
    window.__deep = function(pred, root = document, acc = []) {
      const walk = (node) => {
        if (!node) return;
        if (node.nodeType === 1) {
          try { if (pred(node)) acc.push(node); } catch (e) {}
          if (node.shadowRoot) walk(node.shadowRoot);
        }
        let c = node.firstElementChild || (node.children && node.children[0]);
        for (const child of (node.children || [])) walk(child);
      };
      walk(root);
      return acc;
    };
    """

    async def _ensure_deep(self):
        await self.js(self.DEEP)

    async def click_text(self, text, tag=None, nth=0, wait=1.5):
        """Klikne na vidljiv element čiji tekst sadrži `text`."""
        await self._ensure_deep()
        tag_check = f"&& el.tagName.toLowerCase() === '{tag.lower()}'" if tag else ""
        expr = f"""
        (() => {{
          const t = {json.dumps(text)}.toLowerCase();
          const els = window.__deep(el =>
            el.offsetParent !== null
            && (el.innerText || el.textContent || '').trim().toLowerCase().includes(t)
            {tag_check}
          );
          // Prvo traži pravi kontrol. Najdublji element sa tekstom je obično
          // <span> unutar dugmeta — klik na njega HA ne obradi.
          const CLICKABLE = ['HA-BUTTON','MWC-BUTTON','BUTTON','HA-LIST-ITEM',
                             'MWC-LIST-ITEM','HA-CLICKABLE-LIST-ITEM','A',
                             'HA-ICON-BUTTON','HA-MD-LIST-ITEM','LI'];
          const clickable = els.filter(e => CLICKABLE.includes(e.tagName));
          // među klikabilnima uzmi najdublje (najuži kontrol)
          const narrow = (arr) => arr.filter(e => !arr.some(o => o !== e && e.contains(o)));
          const leaf = els.filter(e => !els.some(o => o !== e && e.contains(o)));
          const pool = clickable.length ? narrow(clickable) : (leaf.length ? leaf : els);
          const el = pool[{nth}];
          if (!el) return null;
          el.scrollIntoView({{block: 'center'}});
          const r = el.getBoundingClientRect();
          return {{x: r.x + r.width / 2, y: r.y + r.height / 2, tag: el.tagName}};
        }})()
        """
        res = await self.js(expr)
        if not res:
            raise RuntimeError(f"nije nađen element sa tekstom: {text!r}")
        # Pravi klik mišem, ne `el.click()`. HA komponente slušaju pointer
        # događaje, pa sintetički `click()` iz JS-a često prođe bez efekta.
        await self.click_at(res["x"], res["y"], wait=wait)
        return res

    async def click_at(self, x, y, wait=1.5):
        for ev in ("mouseMoved", "mousePressed", "mouseReleased"):
            await self.send(
                "Input.dispatchMouseEvent",
                type=ev,
                x=x,
                y=y,
                button="left",
                buttons=1,
                clickCount=1,
            )
        await self.settle(wait)

    async def press(self, key, code=None, vk=None, wait=1.0):
        for t in ("keyDown", "keyUp"):
            await self.send(
                "Input.dispatchKeyEvent",
                type=t,
                key=key,
                code=code or key,
                windowsVirtualKeyCode=vk or 0,
                nativeVirtualKeyCode=vk or 0,
            )
        await self.settle(wait)

    async def fill(self, label, value, wait=0.6):
        """Upiše `value` u polje čiji label/placeholder/name sadrži `label`."""
        await self._ensure_deep()
        expr = f"""
        (() => {{
          const want = {json.dumps(label)}.toLowerCase();
          const inputs = window.__deep(el =>
            (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.offsetParent !== null
          );
          const match = inputs.find(i => {{
            const bits = [i.name, i.placeholder, i.getAttribute('aria-label'),
                          i.id, i.type,
                          i.closest('ha-textfield')?.getAttribute('label'),
                          i.labels && i.labels[0] && i.labels[0].textContent];
            return bits.some(b => (b || '').toLowerCase().includes(want));
          }});
          if (!match) return null;
          const setter = Object.getOwnPropertyDescriptor(
            match.tagName === 'INPUT' ? HTMLInputElement.prototype
                                      : HTMLTextAreaElement.prototype, 'value').set;
          match.focus();
          setter.call(match, {json.dumps(value)});
          match.dispatchEvent(new Event('input', {{bubbles: true, composed: true}}));
          match.dispatchEvent(new Event('change', {{bubbles: true, composed: true}}));
          return true;
        }})()
        """
        if not await self.js(expr):
            raise RuntimeError(f"nije nađeno polje: {label!r}")
        await self.settle(wait)

    async def text_present(self, text):
        await self._ensure_deep()
        return bool(
            await self.js(
                f"window.__deep(el => (el.innerText||'').toLowerCase()"
                f".includes({json.dumps(text.lower())})).length > 0"
            )
        )

    # ---------- video ----------

    async def start_recording(self, fps_hint=10):
        self.frames_dir.mkdir(parents=True, exist_ok=True)
        for f in self.frames_dir.glob("*.jpg"):
            f.unlink()
        self.frame_no = 0
        await self.send(
            "Page.startScreencast",
            format="jpeg",
            quality=85,
            maxWidth=self.width,
            maxHeight=self.height,
            everyNthFrame=1,
        )
        self.recording = True

    async def stop_recording(self):
        await self.send("Page.stopScreencast")
        self.recording = False
        print(f"  kadrova: {self.frame_no}")
