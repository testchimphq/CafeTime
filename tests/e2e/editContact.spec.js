/**
 * This is a TestChimp Smart Test.
 * Version 1.0
 *
 * #editContact #form #input #validation
 *
 */

import { test, expect } from '@playwright/test';
import { SignIn } from '../pages/SignIn';
test.describe('Projects', () => {
  let signin;
  test.beforeEach(async ({ page }) => {
    signin = new SignIn(page);
    await signin.login();
  });
  test('edit contact', async ({ page }) => {
    // @Scenario: can update contact details
    await page.getByRole('link', { name: 'Projects' }).click();

    // @Screen: Projects @State: default
    await page.getByRole('link', { name: 'Marshall St' }).first().click();

    // @Screen: Project Management @State: default
    await page.getByText(`Contact`, { exact: true }).click();
    // @Screen: Project Management @State: manage tab, details loaded
    await ai.act('Click on edit link next to the contact label', { page, test });
    // @Screen: Project Management @State: contacts modal open
    await page.getByText(`Jane DoeRemove from Project`, { exact: true }).click();

    // @Screen: Project Management @State: contact details expanded
    await page.getByRole('textbox', { name: 'First Name' }).fill('Jane');

    await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');

    await ai.act('Input a different phone number by changing the last digit in the number', {
      page,
      test,
    });

    // @Screen: Project Management @State: contacts modal open, changes made
    await page.getByRole('button', { name: 'Confirm' }).click();
  });
});
