import { test, expect } from '@playwright/test';

// Set serial mode so tests run in order and share state
test.describe.configure({ mode: 'serial' });

let joinCode = '';
const teacherEmail = 'admin@alchemistry.com';
const studentEmail = 'student_test@alchemistry.com';
const password = 'password123';

test.describe('Role-Based Flow Verification', () => {

    test('Teacher Phase: Login and Create Classroom', async ({ page }) => {
        await page.goto('/login');
        
        // Login as Teacher
        await page.fill('input[name="email"]', teacherEmail);
        await page.fill('input[name="password"]', password);
        await page.click('button:has-text("Access Lab")');
        
        // Verify Dashboard
        await expect(page).toHaveURL(/\/teacher/, { timeout: 10000 });
        await expect(page.locator('h1')).toContainText('Dashboard', { timeout: 10000 });
        
        // Create Classroom
        const timestamp = Date.now();
        const className = `Auto Class ${timestamp}`;
        await page.fill('input[placeholder*="Class Name"]', className);
        await page.click('button:has-text("Create Class")');
        
        // Wait for classroom card and get join code
        const codeElement = page.locator('.code').first();
        await expect(codeElement).toBeVisible();
        const codeText = await codeElement.innerText();
        joinCode = codeText.replace('CODE: ', '').trim();
        console.log(`Generated Join Code: ${joinCode}`);
        
        // Logout
        await page.click('button:has-text("LOGOUT")');
    });

    test('Student Phase: Join Classroom', async ({ page }) => {
        await page.goto('/login');
        
        // Login as Student
        await page.fill('input[name="email"]', studentEmail);
        await page.fill('input[name="password"]', password);
        await page.click('button:has-text("Access Lab")');
        
        // Verify Dashboard
        await expect(page).toHaveURL(/\/student/, { timeout: 10000 });
        await expect(page.locator('.welcome-text')).toContainText('Test', { timeout: 10000 });
        
        // Join Classroom
        await page.fill('input[placeholder*="ENTER CLASS CODE"]', joinCode);
        await page.click('button:has-text("JOIN CLASSROOM")');
        
        // Verify join success and teacher card
        await expect(page.locator(`text=Successfully joined`)).toBeVisible();
        await expect(page.locator('text=YOUR TEACHER')).toBeVisible();
        
        // Logout
        await page.click('button:has-text("LOGOUT")');
    });

    test('Verification Phase: Teacher sees Student', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="email"]', teacherEmail);
        await page.fill('input[name="password"]', password);
        await page.click('button:has-text("Access Lab")');
        
        // Wait for students to load
        await page.waitForTimeout(2000); 
        
        // Verify student list
        await expect(page.locator('table')).toContainText('Test Student');
    });
});
