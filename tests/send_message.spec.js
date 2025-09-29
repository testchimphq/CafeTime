/*

This is a TestChimp Managed Test.

*/

import { test, expect } from '@playwright/test';
test('send_message', async ({ page, browser, context }) => {
  // Step 1: Go to https://studio--cafetime-afg2v.us-central1.hosted.app/
  await page.goto('https://studio--cafetime-afg2v.us-central1.hosted.app/');
  // Step 2: Type 'alice@example.com' into the email input field on the login page
  await page.getByRole('textbox', { name: 'Email' }).fill('alice@example.com');
  // Step 3: Type 'TestPass123' into the password input field on the login page
  await page.getByRole('textbox', { name: 'Password' }).fill('TestPass123');
  // Step 4: Click on the 'Login' button
  await page.getByRole('button', { name: 'login' }).click();
  // Step 5: Wait for the main dashboard page to load
  await page.waitForLoadState('networkidle');
  // Step 6: Click on the 'Messages' tab in the navigation bar
  await page.getByRole('link', { name: 'Messages' }).click();
  // Step 7: Wait for the Messages page to load
  await page.waitForSelector('button:has-text("Go")');
  // Step 8: Type 'Hello' into the message input field
  await page.getByRole('textbox', { name: 'Message Managers...' }).fill('Hello');
  // Step 9: Click on the 'Send' button to send the message
  await page.getByRole('button', { name: 'Send' }).click();
  // Step 10: Verify that the conversation thread contains a message bubble with the text 'Hello'
  await expect(page.getByRole('button', { name: /You: Hello/i })).toBeVisible();
});