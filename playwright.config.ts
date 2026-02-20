import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests',

  //fullyParallel: false,

  timeout: 60_1000,

  //retries: 2,

  reporter: 'html',

  workers: 1,

  use: {

    baseURL: "https://www.cardekho.com/",

    headless: false,

    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

  ],

});
