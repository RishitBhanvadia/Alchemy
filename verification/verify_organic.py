from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go to Organic page
    print("Navigating to /organic...")
    page.goto("http://localhost:3000/organic")

    # Wait for page load
    print("Waiting for page load...")
    # Expect the title or some element
    expect(page.locator("h1.page-title")).to_have_text("ORGANIC ANALYISIS")

    # Take screenshot of initial state
    page.screenshot(path="verification/organic_initial.png")

    # Find a test button
    # The buttons have text "Group 0 Test", "Group 1 Test", etc.
    btn = page.get_by_role("button", name="Group 0 Test")
    print("Clicking button...")
    btn.click()

    # Wait for the result to appear.
    # The result has class "result_div".
    # It takes 1 second for the loading animation to finish.
    print("Waiting for result...")

    # We can wait for .result_div
    result_div = page.locator(".result_div")
    expect(result_div).to_be_visible(timeout=5000)

    # Take screenshot of result
    print("Taking screenshot...")
    page.screenshot(path="verification/organic_result.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
