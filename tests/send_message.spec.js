/*

This is a TestChimp Managed Test.

*/

import { test, expect } from '@playwright/test';
test('send_message', async ({ page, browser, context }) => {
  // Step 1: Go to https://studio--cafetime-afg2v.us-central1.hosted.app/
  await page.goto('https://studio--cafetime-afg2v.us-central1.hosted.app/');
  // Step 2: Type 'alice@example.com' into the email input field
  await page.getByRole('textbox', { name: 'Email' }).fill('alice@example.com');
  // Step 3: Type 'TestPass123' into the password input field
  await page.getByRole('textbox', { name: 'Password' }).fill('TestPass123');
  // Step 4: Click on the 'Login' button
  await page.getByRole('button', { name: 'Sign In' }).click();
  // Step 5: Wait for navigation to complete after login
  await page.waitForLoadState('networkidle');
  // Step 6: Click on the 'Messages' tab
  await page.getByRole('link', { name: 'Messages' }).click();
  // Step 7: Wait for the message input field to be visible
  await page.getByRole('textbox', { name: 'Message Managers...' }).waitFor({ state: 'visible' });
  // Step 8: Type 'Hello' into the message input field
  await page.getByRole('textbox', { name: 'Message Managers...' }).fill('Hello');
  // Step 9: Click on the 'Send' button for messages
  await page.getByRole('button', { name: 'Send' }).click();
  // Step 10: Verify that the conversation thread contains the message text 'Hello'
  await expect(page.getByRole('button', { name: /Hello/i })).toBeVisible();
});