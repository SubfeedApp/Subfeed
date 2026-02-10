/**
 * Addons
 *
 * Enable capabilities on entities.
 * SDK handles field mapping (sends addon_type internally).
 *
 * Available addon types:
 * - web_search: Search the web via Tavily
 * - web_scrape: Extract content from URLs via Tavily
 * - web_extract: Extract structured data from URLs via Tavily
 *
 * Docs: https://subfeed.app/skill/addons.md
 */
class Addons {
  constructor(client) { this.client = client; }

  /**
   * Enable an addon on an entity.
   * SDK handles field mapping — you pass camelCase, SDK sends snake_case.
   *
   * @param {string} entityId - Entity UUID
   * @param {string} addonType - One of: web_search, web_scrape, web_extract
   * @returns {Promise<{ addon_type: string, enabled: boolean }>}
   *
   * @example
   * await subfeed.addons.enable(entity.id, 'web_search');
   * await subfeed.addons.enable(entity.id, 'web_extract');
   */
  async enable(entityId, addonType) {
    return this.client.post(`/entity/${entityId}/addons`, { addon_type: addonType });
  }

  /**
   * List enabled addons for an entity.
   * @param {string} entityId - Entity UUID
   * @returns {Promise<{ addons: Array<{ type: string, enabled: boolean }> }>}
   */
  async list(entityId) {
    return this.client.get(`/entity/${entityId}/addons`);
  }

  /**
   * Disable an addon.
   * @param {string} entityId - Entity UUID
   * @param {string} addonType - The addon type to disable
   * @returns {Promise<{ addon_type: string, enabled: boolean }>}
   */
  async disable(entityId, addonType) {
    return this.client.delete(`/entity/${entityId}/addons/${addonType}`);
  }
}

module.exports = { Addons };
