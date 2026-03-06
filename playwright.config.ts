import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html',{outputFolder:'tests/reports/html-report'}], ['line']],
  use: {
     baseURL: 'https://codebeautify.org/generate-random-date',
     headless: false,
     launchOptions: {
      slowMo: 0, // Slow down actions by 100ms to better observe test execution
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
