/*

This is a TestChimp Smart Test.
Version: 1.0

#login #messaging #userjourney #communication #social

*/

import { test, expect } from '@playwright/test';
test('send_message', async ({ page, browser, context }) => {
  // Step 1: Go to https://studio--cafetime-afg2v.us-central1.hosted.app/
  await page.goto('https://studio--cafetime-afg2v.us-central1.hosted.app/');
  // Step 2: Click on the login email input field
  await page.getByRole('textbox', { name: 'Email' }).click();
  // Step 3: Type 'alice@example.com' into the email input field
  await page.getByRole('textbox', { name: 'Email' }).fill('alice@example.com');
  // Step 4: Click on the login password input field
  await page.getByRole('textbox', { name: 'Password' }).click();
  // Step 5: Type 'TestPass123' into the password input field
  await page.getByRole('textbox', { name: 'Password' }).fill('TestPass123');
  // Step 6: Click on the login button
  await page.getByRole('button', { name: 'Sign In' }).click();
  // Step 7: Wait for the main dashboard to load
  await page.waitForLoadState('networkidle');
  // Step 8: Click on the 'Messages' tab to navigate to messages
  await page.getByRole('link', { name: 'Messages' }).click();
  // Step 9: Wait for the message input field to be visible
  await page.getByRole('textbox', { name: 'Message Managers...' }).waitFor({ state: 'visible' });
  // Step 10: Click on the message input field
  await page.getByRole('textbox', { name: 'Message Managers...' }).click();
});