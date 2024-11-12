import _ from 'underscore';
import {faker} from '@faker-js/faker';

export default class UptimeAPI {
  constructor(private baseURL: string, private token: string) {}

  private headers() {
    return {
      Authorization: `Token ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  private async deleteAny(url: URL | string) {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers(),
    });
    if (response.status !== 200) {
      throw new Error(`Failed to DELETE ${url.toString()}, status: ${response.status}, body: ${await response.text()}`);
    }
  }

  public async ensureTag(obj: { tag: string; color_hex?: string }) {
    const defaults = {
      color_hex: faker.color.rgb({ prefix: '#' }),
    };
    const url = new URL(`${this.baseURL}/api/v1/check-tags/`);
    url.searchParams.set('search', obj.tag);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers(),
    });
    if (response.status !== 200) {
      throw new Error(`Failed to GET ${url.toString()}: ${response.status}, body: ${await response.text()}`);
    }
    const { count, results } = await response.json();
    if (count > 0) {
      return results[0];
    }
    return await this.createTag({ ...defaults, ...obj });
  }

  public async createTag({ tag, color_hex }: { tag: string; color_hex?: string }) {
    const defaults = {
      color_hex: faker.color.rgb({ prefix: '#' }),
    };
    const url = new URL(`${this.baseURL}/api/v1/check-tags/`);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ ...defaults, tag, color_hex }),
    });
    if (response.status !== 200) {
      throw new Error(`Failed to POST ${url.toString()}, status: ${response.status}, body: ${await response.text()}`);
    }
    return response.json();
  }

  public async createCheck(type: string, obj: any) {
    const defaults = {
      contact_groups: ['Default'],
      locations: ['US East', 'United Kingdom'],
      msp_address: faker.internet.url(),
      msp_interval: 5,
    };
    const url = new URL(`${this.baseURL}/api/v1/checks/add-${type}/`);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({...defaults, ...obj}),
    });
    if (response.status !== 200) {
      throw new Error(`Failed to POST ${url.toString()}, status: ${response.status}, body: ${await response.text()}`);
    }
    return response.json();
  }

  public async deleteChecksBy({ tag, search }: { tag?: string; search?: string }) {
    const url = new URL(`${this.baseURL}/api/v1/checks/`);
    if (tag) {
      url.searchParams.set('tag', tag);
    }
    if (search) {
      url.searchParams.set('search', search);
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers(),
    });
    const { status } = response;
    if (status !== 200) {
      throw new Error(`Failed to GET ${url.toString()}, status: ${status}, body: ${await response.text()}`);
    }
    const { results } = await response.json();
    _.map(results, async ({ url }) => await this.deleteAny(url));
  }
}
