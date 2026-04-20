/*
 */

import { test, expect } from '@playwright/test';

test('userMessagingFlow', async ({ page, test }) => {
  var url = process.env.BASE_URL;
  var username = process.env.USERNAME;
  // @Screen: Login / Registration Portal @State: not logged in
  await page.goto(url);
  // @Screen: Dashboard @State: shift calendar, week view
  // Type 'alice@example.com' into email field
  await page.getByLabel('Email').fill(username);
  // Type 'TestPass123' into password field
  await page.getByLabel('Password').fill('TestPass123');
  // @Screen: Dashboard @State: shift calendar, week view
  // Click on login button
  await page
    .getByRole('button', {
      name: 'Sign In',
    })
    .click();
  // Wait for messages tab to be visible
  await page.getByText('Messages').waitFor();
  // @Screen: Dashboard @State: messages tab open, conversation selected
  // Click on messages tab
  await page.getByText('Messages').click();
  // Type 'Hello' into message input field
  await page.getByPlaceholder('Message Managers...').fill('Hello');
  // @Screen: Dashboard @State: messages tab open, conversation selected, message present
  // Click on send message button
  await page
    .getByRole('button', {
      name: 'Send',
    })
    .click();
});
