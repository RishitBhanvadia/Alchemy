from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Go to Lab page
        print("Navigating to http://localhost:5173/lab")
        page.goto("http://localhost:5173/lab")

        # Wait for the page to load
        print("Waiting for .lab-page selector...")
        page.wait_for_selector(".lab-page", timeout=10000)

        # Wait for the Status Panel to appear
        print("Waiting for .status-panel selector...")
        page.wait_for_selector(".status-panel", timeout=5000)

        # Take initial screenshot (Empty State)
        print("Taking initial screenshot...")
        page.screenshot(path="verification_screenshots/lab_empty_state.png")

        # Verify text
        content = page.content()
        if "REACTION MONITOR" in content:
            print("Success: REACTION MONITOR found.")
        else:
            print("Failure: REACTION MONITOR not found.")

        if "AWAITING INPUT" in content:
            print("Success: AWAITING INPUT found.")
        else:
            print("Failure: AWAITING INPUT not found.")

        # Interact with sliders to change state
        print("Interacting with sliders...")

        # Add HCl
        page.evaluate("""
            const el = document.getElementById('hcl-range');
            if(el) {
                el.value = 50;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        """)
        time.sleep(1)

        # Check intermediate state
        content = page.content()
        if "Select at least one more chemical" in content:
             print("Success: Guidance update found.")
        else:
             print("Failure: Guidance update missing.")

        # Add NaCl
        page.evaluate("""
            const el = document.getElementById('nacl-range');
            if(el) {
                el.value = 30;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        """)
        time.sleep(1)

        # Take screenshot (Ready State)
        print("Taking ready state screenshot...")
        page.screenshot(path="verification_screenshots/lab_ready_state.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification_screenshots/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
