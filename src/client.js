/**
 * Subfeed API Client
 *
 * Base URL: https://api.subfeed.app/v1
 * Auth: Bearer token (sf_live_* or sf_agent_*)
 * All responses are JSON: { success: boolean, data?: any, error?: { message, code } }
 *
 * Full API docs: https://subfeed.app/skill.md
 */
const DEFAULT_BASE_URL = 'https://api.subfeed.app/v1';

class SubfeedClient {
  /**
   * @param {Object} options
   * @param {string} options.apiKey - API key (sf_live_*) or agent token (sf_agent_*)
   * @param {string} [options.baseUrl] - Override base URL (for self-hosted or dev)
   */
  constructor({ apiKey, baseUrl } = {}) {
    if (!apiKey) throw new Error('apiKey is required. Get one at https://subfeed.app/skill.md');
    this.apiKey = apiKey;
    this.baseUrl = (baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
  }

  /**
   * Make an authenticated request to the Subfeed API.
   *
   * @param {string} method - HTTP method
   * @param {string} path - API path (e.g., '/entity')
   * @param {Object} [body] - Request body (JSON)
   * @returns {Promise<Object>} Parsed response data
   * @throws {SubfeedError} On API errors
   */
  async request(method, path, body) {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(json.error?.message || `API error: ${res.status}`);
      err.status = res.status;
      err.code = json.error?.code;
      err.name = 'SubfeedError';
      throw err;
    }

    return json.data !== undefined ? json.data : json;
  }

  get(path) { return this.request('GET', path); }
  post(path, body) { return this.request('POST', path, body); }
  patch(path, body) { return this.request('PATCH', path, body); }
  delete(path) { return this.request('DELETE', path); }
}

module.exports = { SubfeedClient };
