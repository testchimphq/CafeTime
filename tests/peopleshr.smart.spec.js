/*

This is a TestChimp Smart Test.
Version: 1.0

#login #employeeinformation #corehr #admin #userjourney

*/

import { test, expect } from '@playwright/test';
test('peopleshr', async ({ page, browser, context }) => {
  // go to https://hrmv100idqaupgrade.phrsandbox.dev/hr/home/index
  await page.goto('https://hrmv100idqaupgrade.phrsandbox.dev/hr/home/index', { timeout: 60000, waitUntil: 'load' });
  await expect(page).toHaveURL(/\/hr\/(home\/index|security\/login)/);
  // login with credentials: Willy, Willy@1234
  await page.getByRole('textbox', { name: 'Username' }).fill('Willy')
  await page.getByRole('textbox', { name: 'Password' }).fill('Willy@1234')
  await page.getByRole('button', { name: 'Login to Continue' }).click()
  await expect(page).toHaveURL(/\/hr\/home\/index/)
  // Click on the all Modules menu item (top menu icon) [FAILED]
  // Attempted: await page.click('#sidebar-toggle-menu')
  // Click on Core HR menu option [SKIPPED]
  // Select Employee Information (under the employee information option) [SKIPPED]
  // Click on New [SKIPPED]
  // Verify new employee information enter form is shown [SKIPPED]
});