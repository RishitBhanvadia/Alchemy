import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to local dev server
        await page.goto("http://localhost:5173")

        # Wait for the react root container to be attached
        await page.wait_for_selector("#root", state="attached")
        await page.wait_for_timeout(5000)

        # Move the mouse around to trigger cursor follower logic
        await page.mouse.move(100, 100)
        await page.wait_for_timeout(1000)

        # Move the mouse to another position and capture screenshot
        await page.mouse.move(500, 500)
        await page.wait_for_timeout(1000)

        await page.screenshot(path="verification_screenshots/cursor_verification.png")

        await browser.close()

        print("Cursor verification complete. Screenshot saved to verification_screenshots/cursor_verification.png")

asyncio.run(run())
