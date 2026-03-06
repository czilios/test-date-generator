import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  globalTimeout: 60 * 60 * 1000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 1 * 60 * 1000,
  reporter: [['html',{ outputFolder: process.env.PW_HTML_REPORT ?? 'tests/reports/html-report', open: 'never' }], ['line']],
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
