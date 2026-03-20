import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to local dev server
        await page.goto("http://localhost:5173/login")

        # Wait for the react root container to be attached
        await page.wait_for_selector("#root", state="attached")
        await page.wait_for_timeout(3000)

        await page.screenshot(path="verification_screenshots/buttons_verification.png")

        await browser.close()

        print("Buttons verification complete. Screenshot saved to verification_screenshots/buttons_verification.png")

asyncio.run(run())
