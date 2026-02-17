from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    try:
        # Navigate
        print("Navigating to http://localhost:5173/lab")
        page.goto("http://localhost:5173/lab")

        # Wait for page to load
        page.wait_for_selector(".lab-page", timeout=10000)
        print("Page loaded")

        # Find HCl slider
        hcl_input = page.locator("#hcl-input")

        # Check initial color
        tube_liquid = page.locator("#permanent")
        print(f"Initial fill: {tube_liquid.get_attribute('fill')}")

        # Use keyboard to change value
        print("Changing HCl input using keyboard...")
        hcl_input.focus()
        # Press right arrow 10 times
        for _ in range(10):
            page.keyboard.press("ArrowRight")

        # Wait for update
        page.wait_for_timeout(1000)

        # Check new color
        new_fill = tube_liquid.get_attribute("fill")
        print(f"New fill: {new_fill}")

        # Also check the input value
        input_val = hcl_input.input_value()
        print(f"Input value: {input_val}")

        if new_fill == "#05B9C4":
            print("VERIFICATION SUCCESS: Color updated correctly!")
        else:
            print(f"VERIFICATION FAILURE: Expected #05B9C4, got {new_fill}")

        # Take screenshot
        page.screenshot(path="verification_lab.png")
        print("Screenshot saved to verification_lab.png")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
