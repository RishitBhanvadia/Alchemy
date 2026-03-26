import { test, expect } from '@playwright/test';
import { mockSupabase } from './helpers/mockSupabase';

// Set serial mode so tests run in order and share state
test.describe.configure({ mode: 'serial' });

let joinCode = '';
const teacherEmail = 'teacher@alchemistry.com';
const studentEmail = 'student@alchemistry.com';
const password = 'password123';

test.describe('Role-Based Flow Verification', () => {
    
    test('Teacher Phase: Login and Create Classroom', async ({ page }) => {
        await mockSupabase(page, { isLoggedIn: false });
        await page.goto('/login');
        
        // Login as Teacher
        await page.getByTestId('email-input').fill(teacherEmail);
        await page.getByTestId('password-input').fill(password);
        
        // Mock session before click
        await mockSupabase(page, { isLoggedIn: true, role: 'teacher' });
        await page.getByTestId('login-submit-btn').click();
        
        // Verify Dashboard
        await expect(page).toHaveURL(/\/teacher/, { timeout: 10000 });
        
        // Wait for loading to clear
        await expect(page.getByTestId('loading-overlay')).not.toBeVisible({ timeout: 15000 });
        
        await expect(page.getByTestId('dashboard-title')).toBeVisible();
        
        // Create Classroom
        const timestamp = Date.now();
        const className = `Auto Class ${timestamp}`;
        await page.getByTestId('classroom-name-input').fill(className);
        await page.getByTestId('create-classroom-btn').click();
        
        // Handle the CreateClassModal - Wait for modal and click Zoom Meeting option
        const zoomOption = page.locator('button.meeting-option-card').filter({ hasText: 'Zoom Meeting' });
        await expect(zoomOption).toBeVisible({ timeout: 10000 });
        await zoomOption.click();
        
        // Wait for classroom card and get join code
        const codeElement = page.getByTestId('join-code-value').first();
        await expect(codeElement).toBeVisible();
        const codeText = await codeElement.innerText();
        joinCode = codeText.trim();
        console.log(`Generated Join Code: ${joinCode}`);
        
        // Logout
        await page.getByTestId('logout-btn').click();
        await expect(page).toHaveURL(/.*login/);
    });

    test('Student Phase: Join Classroom', async ({ page }) => {
        await mockSupabase(page, { isLoggedIn: false });
        await page.goto('/login');
        
        // Login as Student
        await page.getByTestId('email-input').fill(studentEmail);
        await page.getByTestId('password-input').fill(password);
        
        // Mock student session before click
        await mockSupabase(page, { isLoggedIn: true, role: 'student', userId: '00000000-0000-0000-0000-000000000002' });
        await page.getByTestId('login-submit-btn').click();
        
        // Verify Dashboard
        await expect(page).toHaveURL(/\/student/, { timeout: 10000 });
        await expect(page.getByTestId('welcome-text')).toBeVisible();
        
        // Join Classroom
        await page.getByTestId('join-code-input').fill(joinCode || 'CHEM101');
        await page.getByTestId('join-classroom-btn').click();
        
        // Verify join success (toast message or card appears)
        await expect(page.locator('text=Successfully joined')).toBeVisible();
        
        // Logout
        await page.getByTestId('logout-btn').click();
        await expect(page).toHaveURL(/.*login/);
    });

    test('Verification Phase: Teacher sees Student', async ({ page }) => {
        await mockSupabase(page, { isLoggedIn: true, role: 'teacher' });
        await page.goto('/teacher');
        
        // The mock for class_memberships is now in mockSupabase helper
        await page.reload();
        
        // Verify student list/table
        await expect(page.locator('table')).toContainText('Alice Student');
    });
});
