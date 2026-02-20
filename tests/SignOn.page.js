 import { Page, expect } from '@playwright/test';

export class SignOn {
  constructor(page) {
    this.page = page;
  }

  async login() {
    // Go to the OpenSolar application
    await this.page.goto('https://app.opensolar.com');
    // @Screen: Login Page @State: login
    // Fill in email and password for login
    await this.page.locator('#login-form-email').fill(process.env.USERNAME);
    await this.page.locator('#login-form-password').fill(process.env.PASSWORD);

    // Click on the Sign In button to log in
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
}
