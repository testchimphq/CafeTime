/**  This file illustrates:
  - This one should cause a conflict
-  this too
**/

import { test, expect } from '@playwright/test';
import {SignIn} from "../../pages/SignIn.page.js";
import { ai } from 'ai-wright';

test.describe('Messaging', () => {
  let signin;
  test.beforeEach(async ({ page }) => {
    signin = new SignIn(page);
    await signin.login();
  });

  test('sendMessage_success', async ({ page, browser, context }) => {
    // @Scenario: Sending a non empty message should succeed

    await page.getByText('Messages').waitFor();
    // @Screen: Dashboard @State: regular user, weekly view
    await page.getByText('Messages').click();
    // @Screen: Messages @State: Managers conversation selected, empty
    await ai.act("Send message 'Hello'", { page, test });
    // @Screen: Messages @State: conversation open, message present
    await ai.verify("Verify the message 'Hello' appears in the conversation box", { page, test });
  });

});
