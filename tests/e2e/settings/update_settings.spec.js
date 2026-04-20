/**
 * This is a TestChimp Smart Test.
 * Version 1.0
 *
 * #settings #profile #update
 *
 * NOTES:
 * - The Email field was clicked but not filled again after the initial entry, suggesting incomplete testing of the email handling.
 * - No confirmation or assertion of successful profile update after clicking 'Update Profile'.
 * - Selector for the 'Update Profile' button might be fragile; consider verifying the text.
 * - Clicking on the Mobile Phone Number field is redundant as the value was filled immediately after.
 * - Possible timing issues when navigating to and filling elements could lead to test instability.
 */

import { test, expect } from '@playwright/test';

test('SettingsUpdate', async ({ page }) => {
  // @Scenario: #TS-100 update name successfully
  // @Screen: Login Page @State: sign in tab, email invalid, password filled
  // Navigate to CafeTime home page
  await page.goto(`https://cafetime-demo.web.app/`);
  // @Screen: Dashboard @State: regular user, weekly view
  // Fill in the Email address
  await page
    .getByRole('textbox', {
      name: 'Email',
    })
    .fill('alice@example.com');
  // @Screen: Settings @State: Default
  // Fill in the Password
  await page
    .getByRole(`textbox`, {
      name: `Password`,
    })
    .fill(`TestPass123`);
  // @Screen: Settings @State: profile updated, notification visible
  // Click Sign In button to access the login page
  await page
    .getByRole(`button`, {
      name: `Sign In`,
    })
    .click();
  // Navigate to Settings page
  await page.getByRole('link', { name: 'Settings' }).click();
  // @Screen: Settings @State: profile updated, notification visible
  // Fill in the Name field
  await page
    .getByRole(`textbox`, {
      name: `Name`,
    })
    .fill(`Alice Smith New`);
  // Update the Mobile Phone Number
  await page
    .getByRole(`textbox`, {
      name: `Mobile Phone Number (for SMS notifications)`,
    })
    .fill(`+15551234568`);
  // Click Update Profile button to save changes
  await page
    .getByRole(`button`, {
      name: `Update Profile`,
    })
    .click();
  await page.getByRole('link').click();
  await ai.act('signin with credentials xyz, ptestpass', { page, test });
  await ai.verify('there are no error message', { page, test });
  await page.getByText('Login').click();
  // @Scenario:
});
