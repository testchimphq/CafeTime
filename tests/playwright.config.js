import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
SETUP INSTRUCTIONS FOR CI:
1) run `npm install playwright-testchimp-reporter` in your repo.
2) Ensure the TESTCHIMP_API_KEY, TESTCHIMP_PROJECT_ID environment variables are set in the CI environment.
3) Sync this 'tests' folder to a folder in your repo (Click "Sync with GitHub" - in SmartTests page in TestChimp).
4) Setup your git workflow to run tests using standard playwright runner. Sample workflow file: https://github.com/testchimphq/CafeTime/blob/main/.github/workflows/playwright-tests.yml

Note: the runner should be run from the tests folder to ensure proper path resolution (refer sample workflow file).
Full Documentation: https://docs.testchimp.io/smart-tests/run-in-ci-playwright
**/

dotenv.config({
  path: `.env-${process.env.TESTCHIMP_ENV || 'QA'}`
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // This assumes your tests folder name in the repo is "tests".
  testDir: '../tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['playwright-testchimp-reporter', {
      verbose: false
    }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Capture screenshots when tests fail */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
