import fs from 'fs';
import {test as setup} from '@playwright/test';
import UptimeAPI from '../../utils/UptimeAPI';

setup.beforeAll(async ({storageState}) => {
  if (fs.existsSync(storageState as string)) {
    return;
  }
  const stream = fs.createWriteStream(storageState as string);
  stream.write('{}');
  stream.end();
});

setup.beforeAll(async ({baseURL}) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  await api.ensureTag({tag: 'playwright', color_hex: '#444444'});
});

setup('login', async ({baseURL, page, storageState}) => {
  await page.goto(`${baseURL}/launchpad`);
  await page.waitForLoadState('domcontentloaded');

  if (!page.url().endsWith('/accounts/login?next=/launchpad')) {
    return;
  }

  await page.goto(`${baseURL}/accounts/login`);
  await page.waitForLoadState('domcontentloaded');

  await page.locator('[name=username]').fill(process.env.UP_E2E_USERNAME as string);
  await page.locator('[name=password]').fill(process.env.UP_E2E_PASSWORD as string);
  await page.locator('[id*=submit]').click();
  await page.waitForLoadState('domcontentloaded');

  await page.context().storageState({path: storageState as string});
});
