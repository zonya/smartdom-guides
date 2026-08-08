import asyncio
from hadrive import Chrome
BASE = "http://localhost:8124"

async def main():
    c = Chrome("ha-shots", width=1440, height=900, scale=2)
    await c.start()
    try:
        await c.goto(f"{BASE}/home/overview", wait=6)
        await c.start_recording(); await c.settle(2)

        await c.shot("dashboard-prazan", wait=2)
        await c.goto(f"{BASE}/config/dashboard", wait=3);      await c.shot("settings")
        await c.goto(f"{BASE}/config/integrations", wait=3);   await c.shot("integracije-prazno")
        await c.goto(f"{BASE}/config/automation/dashboard", wait=4); await c.shot("automatizacije-lista")
        for slug, name in [("bojler_tarifa","bojler"), ("zvono_slika","zvono"), ("rodjendan","rodjendan")]:
            await c.goto(f"{BASE}/config/automation/edit/{slug}", wait=4)
            await c.shot(f"editor-{name}")
        await c.goto(f"{BASE}/config/automation/edit/new", wait=4); await c.shot("editor-prazan")
        await c.goto(f"{BASE}/developer-tools/template", wait=4);  await c.shot("template-alatka")
        await c.goto(f"{BASE}/config/helpers", wait=3);            await c.shot("pomocnici")

        await c.settle(2); await c.stop_recording()
    finally:
        await c.stop()

asyncio.run(main())
