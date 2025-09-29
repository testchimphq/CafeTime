// shift-calendar.spec.ts
import { test, expect } from '@playwright/test';

// This test checks that the shift calendar displays the user's shifts appropriately.
test.describe('Shift Calendar', () => {
  test('displays the calendar view and user shifts', async ({ page }) => {
    // Step 1: Go to Dashboard section
    await page.goto('http://localhost:9002/dashboard');

    // Step 2: Check the calendar view is present
    // The calendar is inside a Card with a CardTitle containing 'Shift Calendar'
    const calendarTitle = page.getByRole('heading', { name: /shift calendar/i });
    await expect(calendarTitle).toBeVisible();

    // Assert that the calendar table is present (weekly view)
    const calendarTable = page.locator('table');
    await expect(calendarTable).toBeVisible();

    // Optionally, check that at least one shift is displayed (from mock data)
    // e.g., look for a user name from mockShifts in a calendar cell
    await expect(page.getByText(/Alice Smith|Bob Johnson|Charlie/i)).toBeVisible();
  });

  test('week navigation: Today and Week buttons update calendar view', async ({ page }) => {
    // Step 1: Go to Dashboard section (use local dev URL for test)
    await page.goto('http://localhost:9002/dashboard');

    // Step 2: Ensure Shift Calendar is present
    const calendarTitle = page.getByRole('heading', { name: /shift calendar/i });
    await expect(calendarTitle).toBeVisible();

    // Step 3: Click the 'Today' button
    const todayButton = page.getByRole('button', { name: /^Today$/ });
    await todayButton.click();

    // Step 4: Confirm that today's shifts are displayed (look for a known user from mockShifts)
    await expect(page.getByText(/Alice Smith|Bob Johnson|Charlie/i)).toBeVisible();

    // Step 5: Click the 'Week' button to switch to week view
    const weekButton = page.getByRole('button', { name: /^Week$/ });
    await weekButton.click();

    // Step 6: Verify that the calendar table for the week is visible and all mock shifts are present
    const calendarTable = page.locator('table');
    await expect(calendarTable).toBeVisible();
    // Check for all mock shift users in the week view
    await expect(page.getByText('Alice Smith')).toBeVisible();
    await expect(page.getByText('Bob Johnson')).toBeVisible();
    await expect(page.getByText(/Charlie/)).toBeVisible();
  });
}); 