from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Verify Landing Page
    print("Navigating to Landing Page...")
    page.goto("http://localhost:5173/")
    # Wait for the "ALCHEMISTRY" text to be visible
    page.wait_for_selector("text=ALCHEMISTRY")
    # Wait a bit for the 3D scene to load (it's lazy loaded now)
    page.wait_for_timeout(2000)
    page.screenshot(path="verification_landing.png")
    print("Landing Page screenshot saved.")

    # Verify Lab Page
    print("Navigating to Lab Page...")
    page.goto("http://localhost:5173/lab")
    # Wait for the "CHEMICAL RACK" text to be visible
    page.wait_for_selector("text=CHEMICAL RACK")
    page.screenshot(path="verification_lab.png")
    print("Lab Page screenshot saved.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
