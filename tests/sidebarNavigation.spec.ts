import {expect, test} from '@playwright/test';
import exp from 'constants';

test.beforeEach(async ({page, baseURL}) => {
  await page.goto(`${baseURL}/dashboard`);
  await page.waitForLoadState('domcontentloaded');
});

test('C4021 Navigation / Launchpad', async ({baseURL, page}) => {
  await page.click('a[data-menu="launchpad"]');
  await page.waitForLoadState('domcontentloaded');

  await expect(page).toHaveURL(`${baseURL}/launchpad`);
  await expect(page).toHaveTitle('Launchpad | Uptime.com');
  await expect(page.locator('h3.pb-3')).toHaveText('Launchpad');
});

test('C302 Navigation / Dashboard', async ({baseURL, page}) => {
  await page.click('a[data-menu="dashboard"]');
  await page.waitForLoadState('domcontentloaded');

  await expect(page).toHaveURL(`${baseURL}/dashboard/0`);
  await expect(page).toHaveTitle('Dashboard | Uptime.com');
  await expect(page.locator('h1')).toHaveText('Dashboard');
});

test.describe('Monitoring', () => {
  test.beforeEach(async ({page}) => {
    await page.click('a[data-wizard="sidebar-monitoring"]');
    await page.waitForSelector('li[class="has-submenu open"] a[data-wizard="sidebar-monitoring"]');
  });

  test('C1 Navigation / Monitoring / Checks', async ({baseURL, page}) => {
    await page.click('li[data-menu="services"] a');

    await expect(page).toHaveURL(`${baseURL}/devices/services`);
    await expect(page).toHaveTitle('Checks | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Checks');
  });

  test('C4035 Navigation / Monitoring / Transaction', async ({baseURL, page}) => {
    await page.click('li[data-menu="services-TRANSACTION"] a');

    await expect(page).toHaveURL(`${baseURL}/devices/services?monitoring_service_type=TRANSACTION`);
    await expect(page).toHaveTitle('Transaction Checks | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Transaction Checks');
  });

  test('C4023 Navigation / Monitoring / Real User Monitoring', async ({baseURL, page}) => {
    await page.click('li[data-menu="services-RUM2"] a');

    await expect(page).toHaveURL(`${baseURL}/devices/services?monitoring_service_type=RUM2`);
    await expect(page).toHaveTitle('Real User Monitoring Checks | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Real User Monitoring Checks');
  });

  test('C4024 Navigation / Monitoring / Group Checks', async({baseURL, page}) => {
    await page.click('li[data-menu="services-GROUP"] a');

    await expect(page).toHaveURL(`${baseURL}/devices/services?monitoring_service_type=GROUP`);
    await expect(page).toHaveTitle('Group Checks | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Group Checks');
  });

  test('C4036 Navigation / Monitoring / Page Speed', async({baseURL, page}) => {
    await page.click('li[data-menu="services-PAGESPEED"] a');

    await expect(page).toHaveURL(`${baseURL}/devices/services?monitoring_service_type=PAGESPEED`);
    await expect(page).toHaveTitle('Page Speed Checks | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Page Speed Checks');
  });

  test('C4025 Navigation / Monitoring / Uptime Intelligent Analyzer', async ({baseURL, page}) => {
    await page.click('li[data-menu="domaintools"] a');

    await expect(page).toHaveURL(`${baseURL}/domain-health`);
    await expect(page).toHaveTitle('Uptime Intelligent Analyzer | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Uptime Intelligent Analyzer');
  });
  
  test('C991 Navigation / Monitoring / Global Uptime', async ({baseURL, page}) => {
    await page.click('li[data-menu="uptime_test"] a');

    await expect(page).toHaveURL(`${baseURL}/freetools/global-uptime-test`);
    await expect(page).toHaveTitle('Global Uptime Test | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Global Uptime Test');
  });
});

test.describe('Reports', () => {
  test.beforeEach(async ({page}) => {
    await page.click('a[data-wizard="sidebar-reports"]');
    await page.waitForSelector('li[class="has-submenu open"] a[data-wizard="sidebar-reports"]');
  });

  test('C4026 Navigation / Reports / Alerts', async ({baseURL, page}) => {
    await page.click('li[data-menu="alert_history"] a');

    await expect(page).toHaveURL(`${baseURL}/alerting/alert-history`);
    await expect(page).toHaveTitle('Alerts | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Alerts');
  });

  test('C1244 Navigation / Reports / SLA Reports', async ({baseURL, page}) => {
    await page.click('li[data-menu="sla_reports"] a');

    await expect(page).toHaveURL(`${baseURL}/reports/sla`);
    await expect(page).toHaveTitle('SLA Reports | Uptime.com');
    await expect(page.locator('h1')).toHaveText('SLA Reports');
  });

  test('C1176 Navigation / Reports / Scheduled Reports', async ({baseURL, page}) => {
    await page.click('li[data-menu="scheduled_reports"] a');

    await expect(page).toHaveURL(`${baseURL}/reports/scheduled`);
    await expect(page).toHaveTitle('Scheduled Reports | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Scheduled Reports');
  });

  test('C4037 Navigation / Reports / Real User Monitoring', async ({baseURL, page}) => {
    await page.click('li[data-menu="rum2_reports"] a');

    await expect(page).toHaveURL(`${baseURL}/rum/v2`);
    await expect(page).toHaveTitle('Real User Monitoring (V2) | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Real User Monitoring Checks');
  });

  test('C1626 Navigation / Reports / Uptime Widget', async ({baseURL, page}) => {
    await page.click('li[data-menu="widget"] a');

    await expect(page).toHaveURL(`${baseURL}/devices/services/widget`);
    await expect(page).toHaveTitle('Uptime Widget | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Uptime Widget');
  });
});

test.describe("Status Pages", () => {
  test.beforeEach(async ({page}) => {
    await page.click('a[data-wizard="sidebar-statuspages"]');
    await page.waitForSelector('li[class="has-submenu open"] a[data-wizard="sidebar-statuspages"]');
  });

  test('C4027 Navigation / Status Pages / Public Status Pages', async ({baseURL, page}) => {
    await page.click('li[data-menu="statuspages-public"] a');

    await expect(page).toHaveURL(`${baseURL}/statuspages/public`);
    await expect(page).toHaveTitle('Public Status Pages | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Public Status Pages');
  });

  test('C4028 Navigation / Status Pages / Public SLA Pages', async ({baseURL, page}) => {
    await page.click('li[data-menu="statuspages-public-sla"] a');

    await expect(page).toHaveURL(`${baseURL}/statuspages/sla`);
    await expect(page).toHaveTitle('Public SLA Pages | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Public SLA Pages');
  });

  test('C4029 Navigation / Status Pages / Internal Status Pages', async ({baseURL, page}) => {
    await page.click('li[data-menu="statuspages-internal"] a');

    await expect(page).toHaveURL(`${baseURL}/statuspages/internal`);
    await expect(page).toHaveTitle('Internal Status Pages | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Internal Status Pages');
  });

});

test.describe("Notifications", () => {
  test.beforeEach(async ({page}) => {
    await page.click('a[data-wizard="sidebar-notifications"]');
    await page.waitForSelector('li[class="has-submenu open"] a[data-wizard="sidebar-notifications"]');
  });

  test('Navigation / Notifications / Contacts', async ({baseURL, page}) => {
    await page.click('li[data-menu="contact_groups"] a');

    await expect(page).toHaveURL(`${baseURL}/devices/contact-groups`);
    await expect(page).toHaveTitle('Contacts | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Contacts');
  });

  test('Navigation / Notifications / Integrations', async ({baseURL, page}) => {
    await page.click('li[data-menu="integration"] a');

    await expect(page).toHaveURL(`${baseURL}/integrations/manage/`);
    await expect(page).toHaveTitle('Integrations | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Integrations');
  });

  test('Navigation / Notifications / Mobile Apps', async ({baseURL, page}) => {
    await page.click('li[data-menu="mobile_apps"] a');

    await expect(page).toHaveURL(`${baseURL}/mobile-apps`);
    await expect(page).toHaveTitle('Mobile Apps | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Mobile Apps');
  });
});

test.describe("Settings", () => {
  test.beforeEach(async ({page}) => {
    await page.click('a:has-text("Settings")');
    await page.waitForSelector('li[class="has-submenu open"] a:has-text("Settings")');
  });

  test('Navigation / Settings / Account Details', async ({baseURL, page}) => {
    await page.click('li[data-menu="account_details"] a');

    await expect(page).toHaveURL(`${baseURL}/accounts/account-details`);
    await expect(page).toHaveTitle('Account Details | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Account Details');
  });

  test('Navigation / Settings / Users', async ({baseURL, page}) => {
    await page.click('li[data-menu="users"] a');

    await expect(page).toHaveURL(`${baseURL}/accounts/account-users`);
    await expect(page).toHaveTitle('Users | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Users');
  });

  test('Navigation / Settings / SSO', async ({baseURL, page}) => {
    await page.click('li[data-menu="single_sign_on"] a');

    await expect(page).toHaveURL(`${baseURL}/accounts/sso/saml/setup`);
    await expect(page).toHaveTitle('Single Sign-on: Use SAML | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Single Sign-on: Use SAML');
  });

  test('Navigation / Settings / API', async ({baseURL, page}) => {
    await page.click('li[data-menu="api"] a');

    await expect(page).toHaveURL(`${baseURL}/api/tokens`);
    await expect(page).toHaveTitle('API | Uptime.com');
    await expect(page.locator('h1')).toHaveText('API');
  });

  test('Navigation / Settings / Audit Log', async ({baseURL, page}) => {
    await page.click('li[data-menu="auditlog"] a');

    await expect(page).toHaveURL(`${baseURL}/audit/log`);
    await expect(page).toHaveTitle('Audit Log | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Audit Log');
  });
});

test.describe("Billing", () => {
  test.beforeEach(async ({page}) => {
    await page.click('a[data-wizard="sidebar-billing"]');
    await page.waitForSelector('li[class="has-submenu open"] a[data-wizard="sidebar-billing"]');
  });

  test('Navigation / Billing / Subscription Summary', async ({baseURL, page}) => {
    await page.click('li[data-menu="billing_subscription_summary"] a');

    await expect(page).toHaveURL(`${baseURL}/billing/subscription-summary`);
    await expect(page).toHaveTitle('Subscription Summary | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Subscription Summary');
  });

  test('Navigation / Billing / Manage Subscription', async ({baseURL, page}) => {
    await page.click('li[data-menu="billing_subscription_manage"] a');

    await expect(page).toHaveURL(`${baseURL}/billing/manage-subscription`);
    await expect(page).toHaveTitle('Manage Subscription | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Manage Subscription');
  });

  test.skip('Navigation / Billing / Manage Add-Ons', async ({baseURL, page}) => {
    await page.click('li[data-menu="billing_subscription"] a');

    await expect(page).toHaveURL(`${baseURL}/billing/manage-add-ons`);
    await expect(page).toHaveTitle('Configure Subscription | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Manage Add-Ons');
  });

  test('Navigation / Billing / Invoices', async ({baseURL, page}) => {
    await page.click('li[data-menu="billing_history"] a');

    await expect(page).toHaveURL(`${baseURL}/billing/history`);
    await expect(page).toHaveTitle('Invoices | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Invoices');
  });

  test('Navigation / Billing / Account Usage', async ({baseURL, page}) => {
    await page.click('li[data-menu="account_usage"] a');

    await expect(page).toHaveURL(`${baseURL}/accounts/account-usage`);
    await expect(page).toHaveTitle('Account Usage | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Account Usage');
  });
});

test.describe("Support", () => {
  test.beforeEach(async ({page}) => {
    await page.click('a[data-wizard="sidebar-support"]');
    await page.waitForSelector('li[class="has-submenu open"] a[data-wizard="sidebar-support"]');
  });

  test('Navigation / Support / Documentation', async ({page}) => {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('a:has-text("Documentation")')
    ]);

    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL('https://support.uptime.com/hc/en-us');
    await newPage.waitForSelector('h2:has-text("What can we help you with?")');
  });

  test('Navigation / Support / Tours & Guides', async ({page}) => {
    await page.click('#appcues-launchpad');
    await expect(page.locator('h4')).toHaveText('Tours & Guides');
  });

  test('Navigation / Support / Uptime.com Status', async ({page}) => {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('a:has-text("Uptime.com Status")')
    ]);

    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL('https://status.uptime.com/');
    await expect(newPage).toHaveTitle('Uptime.com Status | Uptime.com');
  });

  test('Navigation / Support / Contact Support', async ({baseURL, page}) => {
    await page.click('[data-menu="contact"] a');

    await expect(page).toHaveURL(`${baseURL}/contact`);
    await expect(page).toHaveTitle('Contact Us | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Contact Us');
  });

  test('Navigation / Support / Public Probe Servers', async ({baseURL, page}) => {
    await page.click('[data-menu="monitoring_servers"] a');

    await expect(page).toHaveURL(`${baseURL}/monitoring/servers`);
    await expect(page).toHaveTitle('Public Probe Servers | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Public Probe Servers');
  });

  test('Navigation / Support / Private Location Status', async ({baseURL, page}) => {
    await page.click('[data-menu="private-locations"] a');

    await expect(page).toHaveURL(`${baseURL}/monitoring/private-locations`);
    await expect(page).toHaveTitle('Private Locations Status | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Private Locations Status');
  });

  test('Navigation / Support / Release Notes', async ({page}) => {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('a:has-text("Release Notes")'),
    ]);

    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL('https://uptime.com/changelog');
    await expect(newPage).toHaveTitle('Changelog - Uptime.com');
    await expect(newPage.locator('h1')).toHaveText('Release Notes');
  });

  test('Navigation / Support / Blog', async ({page}) => {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('a:has-text("Blog")'),
    ]);
    
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL('https://uptime.com/blog/');
    await expect(newPage).toHaveTitle('Uptime.com -');
    await expect(newPage.locator('h1')).toHaveText('Uptime Monitoring News');
  });
});

test.describe("Profile Menu", () => {
  test.beforeEach(async ({page}) => {
    await page.click('div.sidebar-footer li[class="has-submenu"] > ul + a');
    await page.waitForSelector('div.sidebar-footer li[class="has-submenu open"] > ul + a');
  });

  test('Navigation / Profile Menu / User Profile', async ({baseURL, page}) => {
    await page.click('[data-menu="edit_profile"] a');

    await expect(page).toHaveURL(`${baseURL}/accounts/profile`);
    await expect(page).toHaveTitle('User Profile | Uptime.com');
    await expect(page.locator('h1')).toHaveText('User Profile');
  });

  test('Navigation / Profile Menu / Change Password', async ({baseURL, page}) => {
    await page.click('[data-menu="change_password"] a');

    await expect(page).toHaveURL(`${baseURL}/accounts/change-password`);
    await expect(page).toHaveTitle('Change Password | Uptime.com');
    await expect(page.locator('h1')).toHaveText('Change Password');
  });

  test('Navigation / Profile Menu / Log Out', async ({baseURL, page}) => {
    await page.click('li[class="has-submenu open"] a[href="/accounts/logout"]');  

    await expect(page).toHaveURL(`${baseURL}/accounts/logout`);
    await expect(page).toHaveTitle('Logout | Uptime.com');
  });
});
