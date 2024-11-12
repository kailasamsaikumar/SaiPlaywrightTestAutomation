import _ from 'underscore';
import dotenv from 'dotenv';
import {defineConfig, devices} from '@playwright/test';

dotenv.config();

if (process.env.UP_E2E_URL === undefined) {
  throw new Error('UP_E2E_URL is not defined');
}

if (process.env.UP_E2E_USERNAME === undefined) {
  throw new Error('UP_E2E_USERNAME is not defined');
}

if (process.env.UP_E2E_PASSWORD === undefined) {
  throw new Error('UP_E2E_PASSWORD is not defined');
}

if (process.env.UP_E2E_API_TOKEN === undefined) {
  throw new Error('UP_E2E_PASSWORD is not defined');
}

const httpCredentials = _.all([process.env.UP_E2E_HTTP_BASIC_USERNAME, process.env.UP_E2E_HTTP_BASIC_PASSWORD])
  ? {
      httpCredentials: {
        username: process.env.UP_E2E_HTTP_BASIC_USERNAME as string,
        password: process.env.UP_E2E_HTTP_BASIC_PASSWORD as string,
      },
    }
  : {};

/**
 * See https://playwright.dev/docs/test-configuration.
 */ 
export default defineConfig({
  globalTimeout: 600000,
  expect: {
    timeout: 10000,
  },
  timeout: 180000,

  testDir: 'tests',
  workers: 1,

  // NOTE: Please keep it in sequential mode. Playwright doesn't guarantee proper hooks execution when parallel. That
  //       _will_ result in flaky tests and hard to debug concurrency issues.
  fullyParallel: false,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  reporter: "html",
  // reporter: process.env.CI
  //   ? [['dot'], ['json', {outputFile: 'test-report.json'}], ['./utils/Reporter.ts']]
  //   : [['list']],
  use: {
    baseURL: process.env.UP_E2E_URL,
    actionTimeout: 0,
    trace: 'on-first-retry',
    headless: true,
    screenshot: 'only-on-failure',
    viewport: {width: 1536, height: 824},
    storageState: './.state.json',
    ...httpCredentials,
  },
  projects: [
    {
      name: 'setup',
      testMatch: 'setup/*.ts',
    },
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
      dependencies: ['setup'],
      testMatch: '*.spec.ts',
    },
  ],
});
