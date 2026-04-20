/*
 */

import { test, expect } from '@playwright/test';
import { ai } from 'ai-wright';
import 'playwright-testchimp/runtime';

test('new-test', async ({ page, browser, context }) => {
  await page.goto('/');
});
