// checkout.spec.js (remote)
import { test, expect } from '@playwright/test';

test('checkout flow', async ({ page }) => {
  await page.goto('/cart');
  await page.click('text=Buy now');              // remote change to the same base line
  await expect(page).toHaveURL('/checkout');
});
