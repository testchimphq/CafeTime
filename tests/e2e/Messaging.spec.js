import { test, expect } from '@playwright/test';
test('userMessagingFlow', async ({ page, browser, context }) => {
  // @Scenario: Can send messages to managers successfully
  await page.goto(`https://cafetime-demo.web.app/`);
  // Type 'alice@example.com' into email field
  await page.getByLabel('Email').fill('alice@example.com');
  // Type 'TestPass123' into password field
  await page.getByLabel('Password').fill('TestPass123');
  // Click on login button
  await page.getByRole('button', { name: 'Sign In' }).click();
  // Wait for messages tab to be visible
  await page.getByText('Messages').waitFor();
  // Click on messages tab
  await page.getByText('Messages').click();
  // Type 'Hello' into message input field
  await page.getByPlaceholder('Message Managers...').fill('Hello');
  // Click on send message button
  await page.getByRole('button', { name: 'Send' }).click();
});

test('emptyMessage_sendDisabled', async ({ page, browser, context }) => {
  // @Scenario: empty messages cannot be sent
  await page.goto(`https://cafetime-demo.web.app/`);
  // Type 'alice@example.com' into email field
  await page.getByLabel('Email').fill('alice@example.com');
  // Type 'TestPass123' into password field
  await page.getByLabel('Password').fill('TestPass123');
  // Click on login button
  await page.getByRole('button', { name: 'Sign In' }).click();
  // Wait for messages tab to be visible
  await page.getByText('Messages').waitFor();
  // Click on messages tab
  await page.getByText('Messages').click();
  // Type 'Hello' into message input field
  await page.getByPlaceholder('Message Managers...').fill(' ');
  // Click on send message button
  await expect(page.getByText(`Send`, { exact: true })).toBeDisabled();
});