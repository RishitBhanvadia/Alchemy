from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Verify Landing Page
        print("Navigating to Landing Page...")
        try:
            page.goto("http://localhost:5173/")
        except Exception as e:
            print(f"Failed to load page: {e}")
            return

        # Wait for title (Critical Content)
        try:
            page.wait_for_selector("text=ALCHEMISTRY", timeout=10000)
            print("Landing page title found.")
        except:
            print("Landing page title NOT found.")

        if not os.path.exists("verification_screenshots"):
            os.makedirs("verification_screenshots")

        page.screenshot(path="verification_screenshots/landing_initial.png")
        print("Initial screenshot taken.")

        # Wait for 3D canvas to potentially load (it's lazy loaded)
        time.sleep(3)
        page.screenshot(path="verification_screenshots/landing_loaded.png")
        print("Loaded screenshot taken.")

        # Verify Lab Page
        print("Navigating to Lab Page...")
        page.goto("http://localhost:5173/lab")

        # Wait for Chemical Rack
        try:
            page.wait_for_selector("text=CHEMICAL RACK", timeout=5000)
            print("Lab page loaded.")
            page.screenshot(path="verification_screenshots/lab_page.png")
        except:
            print("Lab page failed to load or requires login.")
            page.screenshot(path="verification_screenshots/lab_fail.png")

        browser.close()

if __name__ == "__main__":
    run()
