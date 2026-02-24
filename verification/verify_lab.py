from playwright.sync_api import sync_playwright

def verify_lab():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to Lab...")
        try:
            page.goto("http://localhost:5173/lab")
        except Exception as e:
            print(f"Error navigating: {e}")
            return

        # Wait for the slider to appear.
        # <label htmlFor="hcl-range">Conc. HCl</label>
        print("Waiting for slider...")
        try:
            # We look for the input with id 'hcl-range'
            slider = page.wait_for_selector("#hcl-range", state="visible", timeout=30000)
        except Exception as e:
            print(f"Failed to find slider: {e}")
            page.screenshot(path="verification/error_lab_load.png")
            browser.close()
            return

        print("Found slider. Setting HCl slider to 50...")

        # For range inputs, fill might work, or we manipulate the value directly
        page.fill("#hcl-range", "50")

        # Dispatch events to ensure React picks it up
        page.evaluate("document.getElementById('hcl-range').dispatchEvent(new Event('input', { bubbles: true }))")
        page.evaluate("document.getElementById('hcl-range').dispatchEvent(new Event('change', { bubbles: true }))")

        # Wait a moment for update (should be instant)
        page.wait_for_timeout(1000)

        # Take screenshot of the whole page
        print("Taking screenshot...")
        page.screenshot(path="verification/lab_interaction.png")

        browser.close()

if __name__ == "__main__":
    verify_lab()
