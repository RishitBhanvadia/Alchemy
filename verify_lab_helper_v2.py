from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 1024}) # Larger viewport
    page = context.new_page()

    print("Navigating to http://localhost:5174/lab")
    page.goto("http://localhost:5174/lab")

    # Wait for the page to load
    initiate_button = page.get_by_role("button", name="INITIATE REACTION")
    print("Waiting for button...")
    expect(initiate_button).to_be_visible(timeout=10000)

    # Check that it is disabled
    print("Verifying button is disabled...")
    expect(initiate_button).to_be_disabled()

    # Check for the helper text
    print("Verifying helper text...")
    helper_text = page.get_by_text("Add at least two chemicals to initiate reaction")
    expect(helper_text).to_be_visible()

    # Get bounding box to debug position
    box = helper_text.bounding_box()
    print(f"Helper text bounding box: {box}")

    # Take a screenshot
    page.screenshot(path="verification_lab_helper_full.png", full_page=True)
    print("Screenshot saved to verification_lab_helper_full.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
