/**
 * This test demonstrates usage of assets/ for actions that require file uploads.
 */

import { test, expect } from '@playwright/test';
import { ai } from 'ai-wright';

test('uploadProfileImage_success', async ({ page }) => {
  // @Scenario: #TS-111 Can update profile pic successfully
  await page.goto('https://cafetime-demo.web.app/');
  await ai.act('Login with creds: "alice@example.com', { page, test });
  await page.getByRole('link', { name: 'My Profile' }).click();
  await page
    .getByRole('button', {
      name: 'Update image',
    })
    .click();
  await page.getByTitle('avatar-upload').setInputFiles(['assets/profile_pic.png']);
});
