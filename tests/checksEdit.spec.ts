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
  page.locator(`span:has-text("${tags[0]}")').waitFor({state: 'visible'}`);
  page.locator(`span:has-text("${tags[1]}")').waitFor({state: 'visible'}`);
});

test('C5 Edit Check / Website HTTP(S)', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  await api.createCheck('http', { name: checkName });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newUrl = faker.internet.url();

  await fillName(newName, { page });
  await fillURL(newUrl, { page });
  await fillTags(tags, { page });

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });

  const { protocol: newProtocol, hostname: newHostname } = new URL(newUrl);
  await expectNameAddress(newName, `${newProtocol}//${newHostname}`, { page });
  await expectNameType(newName, 'HTTP(S)', { page });
});

test('C9 Edit Check / Transaction', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  const url = faker.internet.url();
  const script = '[{"step_def": "C_OPEN_URL", "values":{"url": "' + url + '"}}]';

  await api.createCheck('transaction', { name: checkName, msp_script: script });

  //Check Edit
  const newName = faker.lorem.words(3);

  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('Transaction', { page });

  await fillTags(tags, { page });

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'Transaction', { page });
});

test('C5 Edit Check / API', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  const url = faker.internet.domainName();
  const script = '[{"step_def": "C_POST", "values":{"url": "' + url + '"}}]';

  await api.createCheck('api', { name: checkName, msp_script: script });

  //Check Edit
  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('API', { page });
  await fillTags(tags, { page });

  await page.click('button:text("Add Step")');
  await page.click('a:text("GET"):has(> span:text("URL"))');
  await page.getByLabel('URL*').fill(`https://${newDomain}/api/v1/endpoint`);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectNameAddress(newName, url, { page });
  await expectNameType(newName, 'API', { page });
});

test('C16 Edit Check / Real User Monitoring', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);

  await api.createCheck('rum2', { name: checkName });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('Real User Monitoring', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain*').fill(newDomain);

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForSelector('h5#rum-code', { state: 'visible' });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameAddress(newName, newDomain, { page });
  await expectNameType(newName, 'Real User Monitoring', { page });
});

test('C19 Edit Check / Group', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);

  await api.createCheck('group', { name: checkName });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('Group', { page });
  await fillTags(tags, { page });

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameAddress(newName, 'group', { page });
  await expectNameType(newName, 'group', { page });
});

test('C22 Edit Check / Malware', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  const loc = ['AUTO'];

  await api.createCheck('malware', { name: checkName, locations: loc });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('Malware/Virus', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain*').fill(newDomain);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameAddress(newName, newDomain, { page });
  await expectNameType(newName, 'Malware/Virus', { page });
});

test('C25 Edit Check / SSL Certificate', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  const value = faker.random.numeric(2);
  const loc = ['AUTO'];

  await api.createCheck('ssl-cert', { name: checkName, msp_threshold: value, locations: loc });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();
  const newNumber = faker.random.numeric();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('SSL Certificate', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain*').fill(newDomain);
  await page.getByLabel('Before expiry*').fill(newNumber);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameAddress(newName, newDomain, { page });
  await expectNameType(newName, 'SSL Certificate', { page });
});

test('C28 Edit Check / WHOIS', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const expiryValue = faker.random.numeric(2);
  const checkName = faker.lorem.words(3);
  const value = faker.name.firstName();
  const threshold = faker.random.numeric(2);
  const loc = ['AUTO'];

  await api.createCheck('whois', { name: checkName, locations: loc, value: expiryValue, msp_expect_string: value, msp_threshold: threshold });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = "facebook.com";
  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('Whois/Domain Expiry', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain*').fill(newDomain);
  await page.keyboard.press('Enter');
  await fillExpiryValue(expiryValue, { page });

  await verifyWhoisInfoValue('expires', { page });
  await verifyWhoisInfoValue('nameservers', { page });
  await verifyWhoisInfoValue('registrar', { page });

  await page.getByRole('button', { name: 'Refresh' }).click();
  await page.waitForLoadState("domcontentloaded");

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameAddress(newName, newDomain, { page });
  await expectNameType(newName, 'Whois/Domain Expiry', { page });
});

test('C31 Edit Check / DNS', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  const value = "A";

  await api.createCheck('dns', { name: checkName, msp_dns_record_type: value });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('DNS', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(newDomain);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'DNS', { page });
  await expectNameAddress(newName, newDomain, { page });
});

test('C34 Edit Check / Ping', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);

  await api.createCheck('icmp', { name: checkName });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('Ping (ICMP)', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(newDomain);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'ICMP(Ping)', { page });
  await expectNameAddress(newName, newDomain, { page });
});

test('C37 Edit Check / NTP', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);

  await api.createCheck('ntp', { name: checkName });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('NTP', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(newDomain);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'NTP', { page });
  await expectNameAddress(newName, newDomain, { page });
});

test('C40 Edit Check / SSH', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);

  await api.createCheck('ssh', { name: checkName });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('SSH', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(newDomain);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'SSH', { page });
  await expectNameAddress(newName, newDomain, { page });
});

test('C43 Edit Check / TCP Port', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  const value = faker.random.numeric(4);

  await api.createCheck('tcp', { name: checkName, msp_port: value });

  //Check Edit
  await enterSearchField(checkName, { page })
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('TCP Port', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(newDomain);
  await page.getByLabel('Port*').fill('1234');

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'TCP', { page });
  await expectNameAddress(newName, newDomain, { page });
});

test('C46 Edit Check / UDP', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  const port = faker.random.numeric(4);
  const value = faker.name.firstName();
  const expect = faker.name.lastName();

  await api.createCheck('udp', { name: checkName, msp_port: port, msp_send_string: value, msp_expect_string: expect });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();
  const newPort = faker.random.numeric(4);
  const newValue = faker.name.firstName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('UDP', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(newDomain);
  await page.getByLabel('Port*').fill(newPort);
  await page.getByLabel('String to send*').fill(newValue);
  await page.getByLabel('String to expect*').fill(newValue);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'UDP', { page });
  await expectNameAddress(newName, newDomain, { page });
});

test('C49 Edit Check / IMAP', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);

  await api.createCheck('imap', { name: checkName });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('IMAP', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(newDomain);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'IMAP', { page });
  await expectNameAddress(newName, newDomain, { page });
});

test('C52 Edit Check / POP', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  await api.createCheck('pop', { name: checkName });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('POP', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(newDomain);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'POP', { page });
  await expectNameAddress(newName, newDomain, { page });
});

test('C55 Edit Check / SMTP', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);

  await api.createCheck('smtp', { name: checkName });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('SMTP', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain or IP*').fill(newDomain);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'SMTP', { page });
  await expectNameAddress(newName, newDomain, { page });
});

test('C58 Edit Check / Domain Blacklist', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  const loc = ['AUTO'];

  await api.createCheck('blacklist', { name: checkName, locations: loc });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);
  const newDomain = faker.internet.domainName();

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('Domain Blacklist', { page });
  await fillTags(tags, { page });

  await page.getByLabel('Domain*').fill(newDomain);

  await save({ page });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectName(newName, { page });
  await expectNameType(newName, 'Domain Blacklist', { page });
  await expectNameAddress(newName, newDomain, { page });
});

test('C61 Edit Check / Heartbeat', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  const value = 2.2;

  await api.createCheck('heartbeat', { name: checkName, msp_response_time_sla: value });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('Heartbeat', { page });
  await fillTags(tags, { page });

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForSelector('h5#custom-check-code', { state: 'visible' });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectNameType(newName, 'Heartbeat', { page });
});

test('C64 Edit Check / Incoming Webhook', async ({ baseURL, page }) => {
  const api = new UptimeAPI(baseURL as string, process.env.UP_E2E_API_TOKEN as string);
  const checkName = faker.lorem.words(3);
  const value = 2.2;

  await api.createCheck('webhook', { name: checkName, msp_response_time_sla: value });

  //Check Edit
  await enterSearchField(checkName, { page });
  await clickEditCheck(checkName, { page });

  const newName = faker.lorem.words(3);

  await fillName(newName, { page });
  await expectSelectTypeIsDisabled('Incoming Webhook', { page });
  await fillTags(tags, { page });

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForSelector('h5#custom-check-code', { state: 'visible' });

  await clearSearchField({ page });
  await enterSearchField(newName, { page });
  await expectNameType(newName, 'Incoming Webhook', { page });
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

const fillTags = async (tags: string[], { page }: FillArgs) => {
  await page.locator('label:text("Tags"):visible ~ span.select2 input').click();
  for (const tag of tags) {
    await page.locator(`span.select2-results ul li:text("${tag}")`).click();
  }
  await page.click('div.modal-content:visible', { position: { x: 10, y: 10 } }); // click outside the drop-down selector
};

const fillExpiryValue = async (expiryValue: string, { page }: FillArgs) => {
  await page.getByLabel('Before expiry*').clear();
  await page.getByLabel('Before expiry*').fill(expiryValue);
};

const verifyWhoisInfoValue = async (value: string, { page }: FillArgs) => {
  const locator = page.locator('textarea[name="msp_expect_string"]', { hasText: value });
  await locator.waitFor({ state: 'attached' });
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

const expectSelectTypeIsDisabled = async (checkType: string, { page }: ExpectArgs) => {
  const locator = page.locator(`span.select2-selection [title="${checkType}"]`);
  await Promise.all([
    expect(locator).toHaveText(checkType),
    expect(locator).toBeDisabled()
  ]);
};

type CheckActionArgs = {
  page: Page;
};

const clickEditCheck = async (name: string, { page }: CheckActionArgs) => {
  await page.locator(`tr:has(td > a:text("${name}")) #check-actions [data-tip="Edit Check"]`).click();
  await page.locator('div[data-wizard="services-form"] h3:text("Edit Check")').waitFor({ state: 'visible' });
};

const enterSearchField = async (name: string, { page }: CheckActionArgs) => {
  const searchBar = 'div [class="form-inline"] [placeholder="Search"]';
  await page.locator(searchBar).click();
  await page.locator(searchBar).fill(name);
  await page.waitForLoadState('domcontentloaded');
};

const clearSearchField = async ({ page }: CheckActionArgs) => {
  const searchBar = 'div [class="form-inline"] [placeholder="Search"]';
  await page.locator(searchBar).click();
  await page.locator(searchBar).press('Control+A');
  await page.locator(searchBar).press('Delete');
};
