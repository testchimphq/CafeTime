/**
 * The @Screen and @State annotations are used by exploratory agents for bug attribution to the correct screen / state.
 * These are auto-authored by the agent when the annotations are not present. You can update them to align with your desired reporting app structure.
 */

import { test, expect } from '@playwright/test';
import { ai } from 'ai-wright';

test('validCredentials_shouldSucceed', async ({ page, browser, context }) => {
  // @Scenario: valid credentials should allow users to login
  // Go to https://cafetime-demo.web.app/
  await page.goto('https://cafetime-demo.web.app/');
  // @Screen: Sign In @State: not logged in, sign-in tab active
  // Enter alice@example.com as username
  await page.getByLabel('Email').fill('alice@example.com');
  // Enter TestPass123 as password
  await page.getByLabel('Password').fill('TestPass123');
  // Click on Sign In button
  await page.getByRole('button', { name: 'Sign In' }).click();
  // @Screen: Dashboard @State: shift calendar, week view
});

test('invalidCredentials_shouldFail', async ({ page, browser, context }) => {
  // @Scenario:invalid credentials should be rejected test
  // Go to https://cafetime-demo.web.app/
  await page.goto('https://cafetime-demo.web.app/');
  // @Screen: Login Page @State: not logged in, sign-in tab
  // Enter alice@example.com as username
  await page.getByLabel('Email').fill('alice@example.com');
  // Enter TestPass123 as password
  await page.getByLabel('Password').fill('GarbageValue');
  // Click on Sign In button
  await page.getByRole('button', { name: 'Sign In' }).click();
  // @Screen: Dashboard @State: shift calendar, week view
  // Verify that the user is not allowed in to dashboard page
  await expect(page).not.toHaveURL('https://cafetime-demo.web.app/dashboard');
});
