/**
 * This is a TestChimp Smart Test.
 * Version 1.0
 *
 * #login #search #teamsearch
 *
 */

import { test, expect } from '@playwright/test';
import { ai } from 'ai-wright';

test('search_success', async ({ page }) => {
  // @Scenario: Search functionality returns correct team members for valid queries
  // Navigate to CafeTime homepage
  await page.goto('https://cafetime-demo.web.app/');

  /* @Screen: Login Page @State: sign in tab active */
  // Fill in the email and password to sign in
  await page.getByRole('textbox', { name: 'Email' }).fill('alice@example.com');
  // @Screen: Dashboard @State: regular user
  await page.getByRole('textbox', { name: 'Password' }).fill('TestPass1233');

  // Click the sign-in button
  await page.getByRole('button', { name: 'Sign In' }).click();

  /* @Screen: Dashboard @State: regular user, weekly view */
  // Navigate to Team Search section
  await page.getByText('Team Search', { exact: true }).click();

  /* @Screen: Team Search @State: results visible */
  await page.locator('[placeholder="Search by name or email..."]').fill('alice');

  // Press Enter to perform search
  await page.locator('[placeholder="Search by name or email..."]').press('Enter');

  /* @Screen: Team Search @State: search results, query 'alice' */
  await ai.verify("Verify there is one search result", { page, test });
});

test('search_empty_results', async ({ page }) => {
  // @Scenario:Search functionality handles no results found gracefully
  // Navigate to CafeTime homepage
  await page.goto('https://cafetime-demo.web.app/');

  /* @Screen: Login Page @State: sign in tab active */
  // Fill in the email and password to sign in
  await page.getByRole('textbox', { name: 'Email' }).fill('alice@example.com');
  // @Screen: Dashboard @State: regular user
  await page.getByRole('textbox', { name: 'Password' }).fill('TestPass1233');

  // Click the sign-in button
  await page.getByRole('button', { name: 'Sign In' }).click();

  /* @Screen: Dashboard @State: regular user, weekly view */
  // Navigate to Team Search section
  await page.getByText('Team Search', { exact: true }).click();

  /* @Screen: Team Search @State: results visible */
  await page.locator('[placeholder="Search by name or email..."]').fill('xxxxx');

  // Press Enter to perform search
  await page.locator('[placeholder="Search by name or email..."]').press('Enter');

  /* @Screen: Team Search @State: search results, query 'alice' */
  await ai.verify("Verify there are no search results but that the page isn't broken", { page, test });
});