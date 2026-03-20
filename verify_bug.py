import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Listen for console messages
        page.on("console", lambda msg: print(f"Console [{msg.type}]: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page Error: {err.message}"))

        print("Navigating to http://localhost:5173")
        try:
            await page.goto("http://localhost:5173", timeout=10000)
            await page.wait_for_selector("#root", state="attached")

            # Take screenshot after 2 seconds
            await page.wait_for_timeout(2000)

        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()

asyncio.run(verify())
