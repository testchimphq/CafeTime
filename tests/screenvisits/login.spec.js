// This is a TestChimp Smart Test
// Version 1.0
// TODO: Add intent comments above code sections to enable agent fallback when needed

import { test, expect } from '@playwright/test';
import { ai } from 'ai-wright';

test('Login', async ({ page }) => {
    await page.goto('https://cafetime-demo.web.app');
    // @Screen: LoginPage @State: sign in
    await page.getByLabel('Email').fill('bob@example.com');
    // (no annotation - same screen/state as previous step)
    await page.getByLabel('Password').fill('12234afsed');
    // (no annotation - same screen/state as previous step)
    await page.getByRole('button', {name: 'Sign In'}).click();
    // @Screen: ShiftCalendar @State: week view, empty
});