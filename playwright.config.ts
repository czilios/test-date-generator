import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  globalTimeout: 60 * 60 * 1000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 1 * 60 * 1000,
  // Use Playwright default report folder so `npx playwright show-report` works out of the box.
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
     baseURL: 'https://codebeautify.org/generate-random-date',
     headless: process.env.HEADED === '1' ? false : true,
     launchOptions: {
      // Enable visual debugging only when explicitly requested.
      slowMo: process.env.HEADED === '1' ? 75 : 0,
    },
     screenshot: 'only-on-failure',
     trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
