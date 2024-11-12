import { faker } from "@faker-js/faker";
import { test, expect, Page } from "@playwright/test";
import { type } from "os";


 test.describe('Status Pages', async() => {
    test.beforeEach(async({page, baseURL}) => {
        await page.goto(`${baseURL}/statuspages/public`);
        await expect(page).toHaveTitle('Public Status Pages | Uptime.com');
        await expect(page.locator('h1')).toHaveText('Public Status Pages');
    });

    test.describe.configure({ mode: "parallel"} );

    test('Create Public Status page', async({page}) => {
        await page.getByText('New Public Status Page').click();
        const name = faker.lorem.words(2);

        await fillName(name, {page});
        await save({page});
        await page.waitForLoadState('domcontentloaded');

        //Add Component

      //   await addComponent({page});
      //   await checkDropdown({page});
      //   await selectCheck({page});

      //   await save({page});

      //   //System metrics

      //   await page.waitForLoadState('domcontentloaded');
      //   await metricsTab({page});
      //   await addMetrics({page});
      //   await metricDropdown({page});
      //   await selectCheck({page});

      //   await save({page});

        //Incident
      
        await page.waitForLoadState('domcontentloaded');
        await incidentTab({page});
        await addIncident({page});
        await fillTitle(name, {page});
        await startDatePicker({page});
        await endDatePicker({page});
        await incidentDropdown({page});
        await updateOptions({page});
        await Preview({page});
        await save({page});

        //Maintenance 

        await page.waitForLoadState('domcontentloaded');
        await maintenanceTab({page});
        await scheduleMaintenance({page});
        await fillTitle(name, {page});
        await startDate({page});
        await endDate({page});
        await maintenanceDropdown({page});
        await updateOptions({page});
        await Preview({page});
        await save({page}); 
    });

 });
    


 type FillArgs = {
    page: Page;
  };

 const fillName = async (name: string, {page}: FillArgs) => {
    await page.getByLabel('Name*').fill(name);
 };

 const fillTitle = async (value: string, {page}: FillArgs) => {
   await page.locator('(//label[text()="Title"]/following-sibling::input[@type="text"])[1]').fill(value);
 };

 const selectCheck = async ({page}: FillArgs) => {
   await page.locator("//ul[contains(@class,'results__options')]/li[2]").waitFor({state: 'visible'});
   await page.click("//ul[contains(@class,'results__options')]/li[2]");
   await page.waitForTimeout(500);
};

const addComponent = async({page}: FillArgs) => {
   await page.locator('[data-wizard*="add-component"]').waitFor({state: 'visible'});
   await page.click('[data-wizard*="add-component"]');
   await page.waitForTimeout(500);
};

const checkDropdown = async({page}: FillArgs) => {
   await page.locator('[title*="Link this component"]').waitFor({state: 'visible'});
   await page.click('[title*="Link this component"]');
   await page.waitForTimeout(500);
};

const metricsTab = async({page}: FillArgs) => {
   await page.locator('#section-nav-tab-metrics').waitFor({state: 'visible'});
   await page.click('#section-nav-tab-metrics');
   await page.waitForTimeout(500);
};

const addMetrics = async({page}: FillArgs) =>{
   await page.locator('[data-wizard="statuspages-manage-metrics-add-metric"]').waitFor({state: 'visible'});
   await page.click('[data-wizard="statuspages-manage-metrics-add-metric"]');
   await page.waitForTimeout(500);
};

const metricDropdown = async({page}: FillArgs) => {
   await page.locator('[title*="System Metric"]').waitFor({state: 'visible'});
   await page.click('[title*="System Metric"]');
   await page.waitForTimeout(500);
};

const incidentTab = async({page}: FillArgs) => {
   await page.locator('a#section-nav-tab-incidents').waitFor({state: 'visible'});
   await page.click('a#section-nav-tab-incidents');
   await page.waitForTimeout(500);
};

const addIncident = async({page}: FillArgs) => {
   await page.locator('[class*="btn-outline-primary"]:has-text("Add an Incident")').waitFor({state: 'visible'});
   await page.click('[class*="btn-outline-primary"]:has-text("Add an Incident")');
   await page.waitForTimeout(500);
};

const incidentDropdown = async({page}: FillArgs) => {
   await page.locator('[class="select2-selection__placeholder"]:has-text("Select incident state...")').waitFor({state: 'visible'});
   await page.click('[class="select2-selection__placeholder"]:has-text("Select incident state...")');
   await page.waitForTimeout(500);
};

const startDatePicker = async({page}: FillArgs) => {
   await page.locator('div [class="form-control-label"]:has-text("Starts") ~[data-target-input="nearest"]').waitFor({state: "visible"});
   await page.click('div [class="form-control-label"]:has-text("Starts") ~[data-target-input="nearest"]');
};

const endDatePicker = async({page}: FillArgs) => {
   await page.locator('div [class="form-control-label"]:has-text("Ends") ~[data-target-input="nearest"]').waitFor({state: "visible"});
   await page.click('div [class="form-control-label"]:has-text("Ends") ~[data-target-input="nearest"]');
};

const maintenanceTab = async({page}: FillArgs) => {
   await page.locator('#section-nav-tab-maintenance').waitFor({state: 'visible'});
   await page.click('#section-nav-tab-maintenance');
   await page.waitForTimeout(500);
};

const scheduleMaintenance = async({page}: FillArgs) => {
   await page.locator('[class*="btn-outline-primary"]:has-text("Schedule Maintenance")').waitFor({state: 'visible'});
   await page.click('[class*="btn-outline-primary"]:has-text("Schedule Maintenance")');
   await page.waitForTimeout(500);
};

const startDate = async({page}: FillArgs) => {
   await page.getByLabel('Starts*').click();
   await page.waitForTimeout(500);
};

const endDate = async({page}: FillArgs) => {
   await page.getByLabel('Ends*').click();
};

const maintenanceDropdown = async({page}: FillArgs)=>{
   await page.locator('[title="Scheduled Maintenance"]').waitFor({state: 'visible'});
   await page.click('[title="Scheduled Maintenance"]');
   await page.waitForTimeout(500);
};

const updateOptions = async({page}: FillArgs) => {
const verifyDropdown = '[class*="select2-dropdown"]'
await page.locator(verifyDropdown).waitFor({state: 'visible'});
await page.click('[class="incident-icon notification"]');
await page.waitForTimeout(500);
};

 type SaveArgs = {
    page: Page;
  };

  const save = async ({page}: SaveArgs) => {
    const button = page.getByRole('button', {name: 'Save'})
    await button.scrollIntoViewIfNeeded()
    await button.click()
    await button.waitFor({state: "hidden"})
    await page.waitForSelector('#statuspagesManage', {state: "visible"});
  }

  const Preview = async ({page}: SaveArgs) => {
   const button = page.getByRole('button', {name: 'Preview'})
   await button.scrollIntoViewIfNeeded()
   await button.click()
   await button.waitFor({state: "hidden"})
   await page.waitForSelector('#statuspagesManage', {state: "visible"});
 }

  type EditArgs = {
   page: Page;
  };

  const Delete = async (name: string, {page}: EditArgs) => {
   await page.locator('[data-wizard="sidebar-statuspages-public"]').waitFor({state: 'visible'});
   await page.click('[data-wizard="sidebar-statuspages-public"]');
   await page.locator('tr:has(td > a:text("'+name+'")) td.actions-right [data-tip="More Actions"]').click();
   await page.locator('[class="dropdown-item btn-sm btn-link btn"]:has-text("Delete")').click();
  };

type ClickArgs = {
   page: Page;
}

   