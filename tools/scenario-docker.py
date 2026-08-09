"""Slike za tekst o instalaciji u Dockeru.

Cilj su tri stvari koje se vide SAMO u Container instalaciji:
tip instalacije u System information, stranica „Apps", i spisak Podešavanja.
"""

import asyncio
from hadrive import Chrome

BASE = "http://localhost:8124"


async def main():
    c = Chrome("ha-shots-docker", width=1440, height=900, scale=2)
    await c.start()
    try:
        await c.goto(f"{BASE}/home/overview", wait=6)
        await c.settle(2)

        for path, name in [
            ("/config/dashboard", "podesavanja"),
            ("/config/apps", "apps"),
            ("/config/hardware", "hardware"),
            ("/config/info", "info"),
            ("/config/system_health", "system-health"),
            ("/config/updates", "updates"),
        ]:
            await c.goto(f"{BASE}{path}", wait=4)
            await c.shot(name)
            print(path, "->", name)

    finally:
        await c.stop()


asyncio.run(main())
