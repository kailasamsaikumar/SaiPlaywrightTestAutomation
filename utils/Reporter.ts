import {Reporter as ReporterInterface, TestCase, TestResult} from '@playwright/test/reporter';
import TestrailAPI from './TestrailAPI';

const testrailApi = new TestrailAPI();

export default class Reporter implements ReporterInterface {
  async onTestEnd(test: TestCase, result: TestResult) {
    if (!process.env.UP_E2E_TESTRAIL_ENABLED) {
      return;
    }
    const splitResult = test.title.split(' ');
    const value = splitResult[0];
    const caseID = value.replace('C', '');
    if (result.status === 'failed') {
      await testrailApi.addResultForCase(caseID, result.status, JSON.stringify(result.error?.message));
    }
    if (result.status === 'passed') {
      const message = 'This is passed and commented from automation';
      await testrailApi.addResultForCase(caseID, result.status, message);
    }
  }
}
