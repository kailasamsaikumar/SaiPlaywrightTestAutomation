import {Buffer} from 'buffer';

export default class TestrailAPI {
  headers() {
    return {
      Authorization:
        'Basic ' +
        Buffer.from(process.env.UP_E2E_TESTRAIL_USERNAME + ':' + process.env.UP_E2E_TESTRAIL_PASSWORD).toString(
          'base64'
        ),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  failedCaseData(message: string) {
    return {
      status_id: 5,
      comment: message,
    };
  }

  passedCaseData(message: string) {
    return {
      status_id: 1,
      comment: message,
    };
  }

  async addResultForCase(caseID: string, status: string, message: string) {
    const run_id = process.env.UP_E2E_URL?.includes('staging')
      ? process.env.UP_E2E_TESTRAIL_STAGING_RUN_ID
      : process.env.UP_E2E_TESTRAIL_PRODUCTION_RUN_ID;
    if (!run_id) {
      throw new Error('Testrail run id is not given');
    }
    const url = process.env.UP_E2E_TESTRAIL_ENDPOINT + 'add_result_for_case/' + run_id + '/' + caseID;

    if (status === 'failed') {
      await (async () => {
        await fetch(url, {
          headers: this.headers(),
          method: 'POST',
          body: JSON.stringify(this.failedCaseData(message)),
        });
      })();
    }
    if (status === 'passed') {
      await (async () => {
        await fetch(url, {
          headers: this.headers(),
          method: 'POST',
          body: JSON.stringify(this.passedCaseData(message)),
        });
      })();
    }
  }
}
