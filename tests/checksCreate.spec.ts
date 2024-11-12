import { basename } from 'path';
import { expect, Page, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import UptimeAPI from '../utils/UptimeAPI';

const tags = ['playwright', basename(__filename).split('.')[0]];

test.beforeAll(async ({ baseURL }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  await api.ensureTag({ tag: tags[0] });
  await api.ensureTag({ tag: tags[1] });
  await api.ensureTag({ tag: 'placeholder', color_hex: '#888888' });
  await api.deleteChecksBy({ tag: tags[1] });
  await api.createCheck('http', { name: faker.lorem.words(3), tags: [...tags, 'placeholder'] });
});

test.beforeEach(async ({ baseURL, page }) => {
  await page.goto(`${baseURL}/devices/services`);
  await page.waitForLoadState('domcontentloaded');

  await page.waitForSelector('#buttonBar', { state: 'visible' });
  await expect(page.locator('#buttonBar')).toContainText('All Tags');
  await expect(page.locator('#buttonBar')).toContainText('All Checks');

  // wait for checks index to be visible
  await page.locator('.white-block').waitFor({ state: 'visible' });
  await page.locator(`span:has-text("${tags[0]}")').waitFor({state: 'visible'}`);
  await page.locator(`span:has-text("${tags[1]}")').waitFor({state: 'visible'}`);

  // click "Add New" button
  await page.click(':text("Add New")');
  await page.locator('div[data-wizard="services-form"] h3:text("Add Check")').waitFor({ state: 'visible' });
});

test('C4 Create Check / Website HTTP(S)', async ({ page }) => {
  const name = faker.lorem.words(3);
  const url = faker.internet.url();

  await fillName(name, { page });
  await fillURL(url, { page });
  await fillTags(tags, { page });

  await save({ page });

  await expectName(name, { page });

  const { protocol, hostname } = new URL(url);
  await expectNameAddress(name, `${protocol}//${hostname}`, { page });
  await expectNameType(name, 'HTTP(S)', { page });
});

test('C8 Create Check / Transaction', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('Transaction', { page });
  await fillTags(tags, { page });

  await page.fill('div#transaction-editor input', domain);

  await save({ page });

  await expectName(name, { page });
  await expectNameAddress(name, domain, { page });
  await expectNameType(name, 'Transaction', { page });
});

test('C12 Create Check / API', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('API', { page });
  await fillTags(tags, { page });

  await page.click('button:text("Add Step")');
  await page.click('a:text("GET"):has(> span:text("URL"))');
  await page.getByLabel('URL*').fill(`https://${domain}/api/v1/endpoint`);

  await save({ page });

  await expectNameAddress(name, domain, { page });
  await expectNameType(name, 'API', { page });
});

test('C15 Create Check / Real User Monitoring', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('Real User Monitoring', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain*').fill(domain);

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForSelector('h5#rum-code', { state: 'visible' });

  await save({ page });

  await expectName(name, { page });
  await expectNameAddress(name, domain, { page });
  await expectNameType(name, 'Real User Monitoring', { page });
});

test('C18 Create Check / Group', async ({ page }) => {
  const name = faker.lorem.words(3);

  await fillName(name, { page });
  await selectType('Group', { page });
  await fillTags(tags, { page });

  await save({ page });

  await expectName(name, { page });
  await expectNameAddress(name, 'group', { page });
  await expectNameType(name, 'group', { page });
});

test('C21 Create Check / Malware', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('Malware/Virus', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain*').fill(domain);

  await save({ page });

  await expectName(name, { page });
  await expectNameAddress(name, domain, { page });
  await expectNameType(name, 'Malware/Virus', { page });
});

test('C24 Create Check / SSL Certificate', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();
  const number = faker.random.numeric();

  await fillName(name, { page });
  await selectType('SSL Certificate', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain*').fill(domain);
  await page.getByLabel('Before expiry*').fill(number);

  await save({ page });

  await expectName(name, { page });
  await expectNameAddress(name, domain, { page });
  await expectNameType(name, 'SSL Certificate', { page });
});

test('C27 Create Check / WHOIS', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = "google.com";
  const expiryValue = '30';
  const expiresText = 'expires';
  const nameserversText = 'nameservers';
  const registrarText = 'registrar';

  await fillName(name, { page });
  await selectType('Whois/Domain Expiry', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain*').fill(domain);
  await page.keyboard.press('Enter');
  await fillExpiryValue(expiryValue, { page });

  await verifyWhoisInfoValue(expiresText, { page });
  await verifyWhoisInfoValue(nameserversText, { page });
  await verifyWhoisInfoValue(registrarText, { page });

  await page.getByRole('button', { name: 'Refresh' }).click();
  await page.waitForLoadState("domcontentloaded");

  await save({ page });

  await expectName(name, { page });
  await expectNameAddress(name, domain, { page });
  await expectNameType(name, 'Whois/Domain Expiry', { page });
});

test('C30 Create Check / DNS', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('DNS', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(domain);

  await save({ page });

  await expectName(name, { page });
  await expectNameType(name, 'DNS', { page });
  await expectNameAddress(name, domain, { page });
});

test('C33 Create Check / Ping', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('Ping (ICMP)', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(domain);

  await save({ page });

  await expectName(name, { page });
  await expectNameType(name, 'ICMP(Ping)', { page });
  await expectNameAddress(name, domain, { page });
});

test('C36 Create Check / NTP', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('NTP', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(domain);

  await save({ page });

  await expectName(name, { page });
  await expectNameType(name, 'NTP', { page });
  await expectNameAddress(name, domain, { page });
});

test('C39 Create Check / SSH', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('SSH', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(domain);

  await save({ page });

  await expectName(name, { page });
  await expectNameType(name, 'SSH', { page });
  await expectNameAddress(name, domain, { page });
});

test('C42 Create Check / TCP Port', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('TCP Port', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(domain);
  await page.getByLabel('Port*').fill('1234');

  await save({ page });

  await expectName(name, { page });
  await expectNameType(name, 'TCP', { page });
  await expectNameAddress(name, domain, { page });
});

test('C45 Create Check / UDP', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();
  const port = faker.random.numeric(4);
  const value = faker.name.firstName();

  await fillName(name, { page });
  await selectType('UDP', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(domain);
  await page.getByLabel('Port*').fill(port);
  await page.getByLabel('String to send*').fill(value);
  await page.getByLabel('String to expect*').fill(value);

  await save({ page });

  await expectName(name, { page });
  await expectNameType(name, 'UDP', { page });
  await expectNameAddress(name, domain, { page });
});

test('C48 Create Check / IMAP', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('IMAP', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(domain);

  await save({ page });

  await expectName(name, { page });
  await expectNameType(name, 'IMAP', { page });
  await expectNameAddress(name, domain, { page });
});

test('C51 Create Check / POP', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('POP', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(domain);

  await save({ page });

  await expectName(name, { page });
  await expectNameType(name, 'POP', { page });
  await expectNameAddress(name, domain, { page });
});

test('C54 Create Check / SMTP', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('SMTP', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(domain);

  await save({ page });

  await expectName(name, { page });
  await expectNameType(name, 'SMTP', { page });
  await expectNameAddress(name, domain, { page });
});

test('C57 Create Check / Domain Blacklist', async ({ page }) => {
  const name = faker.lorem.words(3);
  const domain = faker.internet.domainName();

  await fillName(name, { page });
  await selectType('Domain Blacklist', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain*').fill(domain);

  await save({ page });

  await expectName(name, { page });
  await expectNameType(name, 'Domain Blacklist', { page });
  await expectNameAddress(name, domain, { page });
});

test('C60 Create Check / Heartbeat', async ({ page }) => {
  const name = faker.lorem.words(3);

  await fillName(name, { page });
  await selectType('Heartbeat', { page });
  await fillTags(tags, { page });

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForSelector('h5#custom-check-code', { state: 'visible' });
  await save({ page });

  await expectNameType(name, 'Heartbeat', { page });
});

test('C63 Create Check / Incoming Webhook', async ({ page }) => {
  const name = faker.lorem.words(3);

  await fillName(name, { page });
  await selectType('Incoming Webhook', { page });
  await fillTags(tags, { page });

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForSelector('h5#custom-check-code', { state: 'visible' });
  await save({ page });

  await expectNameType(name, 'Incoming Webhook', { page });
});

//
// helpers
//

type FillArgs = {
  page: Page;
};

const fillName = async (name: string, { page }: FillArgs) => {
  await page.getByLabel('Name of check').fill(name);
};

const fillURL = async (url: string, { page }: FillArgs) => {
  await page.getByLabel('URL*').fill(url);
};

const fillExpiryValue = async (expiryValue: string, { page }: FillArgs) => {
  await page.getByLabel('Before expiry*').clear();
  await page.getByLabel('Before expiry*').fill(expiryValue);
};

const verifyWhoisInfoValue = async (value: string, { page }: FillArgs) => {
  const locator = page.locator('textarea[name="msp_expect_string"]', {hasText: value});
   await locator.waitFor({ state: 'attached' });
  };

const selectType = async (type: string, { page }: FillArgs) => {
  await page.locator('span.select2 span[role="textbox"]:text("Website HTTP(S)")').click();
  await page.locator(`span.select2-results ul li:text("${type}")`).click();
};

const fillTags = async (tags: string[], { page }: FillArgs) => {
  await page.locator('label:text("Tags"):visible ~ span.select2 input').click();
  for (const tag of tags) {
    await page.locator(`span.select2-results ul li:text("${tag}")`).click();
  }
  await page.click('div.modal-content:visible', { position: { x: 10, y: 10 } }); // click outside the drop-down selector
};

type SaveArgs = {
  page: Page;
};

const save = async ({ page }: SaveArgs) => {
  const button = page.getByRole('button', { name: 'Save' });
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await button.waitFor({ state: 'hidden' });
  await page.locator('.white-block').waitFor({ state: 'visible' });
};

type ExpectArgs = {
  page: Page;
};

const expectName = async (name: string, { page }: ExpectArgs) => {
  await expect(page.locator(`a:text("${name}")`)).toBeVisible();
};

const expectNameType = async (name: string, type: string, { page }: ExpectArgs) => {
  await expect(page.locator(`tr:has(> td > a:text("${name}")) > td:text("${type}")`)).toBeVisible();
};

const expectNameAddress = async (name: string, address: string, { page }: ExpectArgs) => {
  await expect(page.locator(`a:text("${name}") ~ a > span:text("${address}")`)).toBeVisible();
};
