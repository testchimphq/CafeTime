/*

This is a TestChimp Smart Test.
Version: 1.0

#login #messaging #social #userjourney #conversation

*/

import { test, expect } from '@playwright/test';

test('send_message', async ({ page, browser, context }) => {
  // Go to https://studio--cafetime-afg2v.us-central1.hosted.app/
  await page.goto('https://studio--cafetime-afg2v.us-central1.hosted.app/');
  // Login with alice@example.com, TestPass123
  await page.getByLabel('Email').fill('alice@example.com');
  await page.getByLabel('Password').fill('TestPass123');
  await page.getByRole('button', {name: 'Sign In'}).click();
  // Go to Messages tab
  await page.getByRole('link', {name: 'Messages'}).click();
  // Send a message "Hello"
  await page.getByPlaceholder('Message Managers...').fill('Hello');
  await page.getByRole('button', {name: 'Send'}).click();
  // Verify message input field is now empty
  await expect(page.getByRole('textbox', { name: 'Message Managers...' })).toBeEmpty();
});
