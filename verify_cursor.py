from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:5173")
        page.wait_for_selector("#root", state="attached")

        # Move mouse around to trigger cursor follower
        page.mouse.move(100, 100)
        page.wait_for_timeout(500)
        page.mouse.move(500, 500)
        page.wait_for_timeout(500)

        page.screenshot(path="verification_screenshots/cursor_follower_test.png")
        browser.close()
        print("Frontend verification successful. Screenshot saved.")

if __name__ == "__main__":
    verify_frontend()
