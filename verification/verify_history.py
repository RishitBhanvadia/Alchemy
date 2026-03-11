from playwright.sync_api import sync_playwright

def test_history_page(page):
    # Navigate to the success page which has the layout without auth
    page.goto("http://localhost:5173/")

    # Wait for the page to load
    page.wait_for_selector(".landing-page")

    # Take a screenshot
    page.screenshot(path="verification/history_page.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_history_page(page)
        finally:
            browser.close()
