from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to Dashboard...")
            page.goto("http://localhost:3000/dashboard", timeout=30000)

            # Wait for content
            time.sleep(2)
            page.screenshot(path="verification_dashboard.png")
            print("Dashboard screenshot saved.")

            # Check for practicals
            try:
                # get_by_text returns a locator, need to verify count or visibility
                practicals_header = page.get_by_text("STANDARD PRACTICALS")
                if practicals_header.count() > 0:
                    print("Practicals section visible.")
                else:
                    print("Practicals section NOT visible!")
            except Exception as e:
                print(f"Error checking practicals: {e}")

            # Filter by Class 12
            print("Filtering by Class 12...")
            page.get_by_role("button", name="CLASS 12").click()
            time.sleep(1)
            page.screenshot(path="verification_dashboard_filtered.png")
            print("Filtered dashboard screenshot saved.")

            # Go to Lab
            print("Navigating to Lab...")
            page.goto("http://localhost:3000/lab")
            time.sleep(2) # Wait for page load

            # Interact with sliders
            print("Adjusting HCl and NaCl concentration...")

            # React select/input handling is tricky with just 'fill'.
            # We need to dispatch events.

            # Need to select sliders.
            # Use page.evaluate to find them and set values.
            page.evaluate("""
                const sliders = document.querySelectorAll('.sci-fi-range');
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

                if (sliders.length > 0) {
                    nativeInputValueSetter.call(sliders[0], 40);
                    sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
                }

                if (sliders.length > 1) {
                    nativeInputValueSetter.call(sliders[1], 40);
                    sliders[1].dispatchEvent(new Event('input', { bubbles: true }));
                }
            """)

            time.sleep(1)
            page.screenshot(path="verification_lab_slider_moved.png")
            print("Sliders moved.")

            # Click Initiate Reaction
            print("Initiating reaction...")
            btn = page.locator(".action-button")

            # Wait for button to be enabled
            if btn.is_disabled():
                print("Button still disabled? waiting...")
                time.sleep(2)

            if btn.is_enabled():
                btn.click()
                print("Button clicked.")
                # Check for loading spinner text or class
                time.sleep(0.5)

                # Check if text changed to PROCESSING... or contains spinner
                content = btn.inner_html()
                print(f"Button content: {content}")

                page.screenshot(path="verification_lab_loading.png")
                print("Loading state captured.")
            else:
                print("Button disabled! Logic check failed.")
                page.screenshot(path="verification_lab_disabled.png")

        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
