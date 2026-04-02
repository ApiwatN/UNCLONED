import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Run sequentially to avoid race conditions with shared DB
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'th-TH',
    viewport: { width: 1280, height: 800 },
    // Pass Basic Auth credentials for the /admin protected routes
    httpCredentials: {
      username: 'admin',
      password: process.env.ADMIN_PASSWORD || 'uncloned2026',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],

  // Dev server is already running (npm run dev), so no need to start it
  webServer: undefined,
});
