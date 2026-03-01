import { Page, expect } from '@playwright/test';

export class SignIn {
  constructor(page) {
    this.page = page;
  }

// Updated
  async login() {
    await this.page.goto(process.env.BASE_URL);
    await this.page.getByTestId('input-email').fill(process.env.USERNAME);
    await this.page.getByTestId('input-pass').fill(process.env.PASSWORD);
    await this.page.getByTestId('cta-login').click();

  }
}
