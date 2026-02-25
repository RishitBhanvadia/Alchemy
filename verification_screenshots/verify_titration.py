from playwright.sync_api import sync_playwright

def verify_titration():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))

        print("Navigating to Titration page...")
        try:
            page.goto("http://localhost:5173/titration", timeout=60000)

            # Wait for page to load
            print("Waiting for .titration-page selector...")
            page.wait_for_selector(".titration-page", timeout=60000)
            print("Page loaded.")

            # Take initial screenshot
            page.screenshot(path="verification_screenshots/verification_initial.png")

            # Click CONFIRM SELECTION
            print("Clicking Confirm Selection...")
            page.click("text=CONFIRM SELECTION")

            # Click ADD 10ML ACID
            print("Clicking Add Acid...")
            page.click("text=ADD 10ML ACID")

            # Click ADD INDICATOR
            print("Clicking Add Indicator...")
            page.click("text=ADD INDICATOR")

            # Click DROP
            print("Clicking Drop...")
            page.click("text=DROP")

            # Wait for some time to let the timer run (and verify optimization doesn't crash it)
            print("Waiting for timer...")
            page.wait_for_timeout(2000) # 2 seconds

            # Click STOP
            print("Clicking Stop...")
            page.click("text=STOP")

            # Take screenshot of active state
            print("Taking screenshot...")
            page.screenshot(path="verification_screenshots/verification_titration.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_screenshots/error.png")

        browser.close()

if __name__ == "__main__":
    verify_titration()
