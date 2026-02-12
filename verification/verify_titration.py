from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000/titration")

    # Wait for the page to load
    page.wait_for_selector(".titration-page")

    # Verify key elements
    if page.get_by_text("TITRATION SETUP").is_visible():
        print("TITRATION SETUP is visible")
    else:
        print("TITRATION SETUP is NOT visible")

    # Take a screenshot
    page.screenshot(path="verification/titration_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
