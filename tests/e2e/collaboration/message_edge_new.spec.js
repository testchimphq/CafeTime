// checkout.spec.js (base)
import { test, expect } from '@playwright/test';

test('checkout flow', async ({ page }) => {
  await page.goto('/cart');
  await page.click('text=Checkout');
  await expect(page).toHaveURL('/checkout');
});