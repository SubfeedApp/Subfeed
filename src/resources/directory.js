/**
 * Public Entity Directory
 *
 * Browse and invoke public entities. No auth needed.
 *
 * Docs: https://subfeed.app/skill/directory.md
 */
class Directory {
  constructor(client) { this.client = client; }

  /**
   * Browse public entities.
   * No auth needed.
   *
   * @param {Object} [options]
   * @param {number} [options.page=1] - Page number (min: 1)
   * @param {number} [options.limit=20] - Items per page (1-100)
   * @param {string} [options.search] - Search query (1-100 chars)
   * @returns {Promise<{ data: Array, pagination: { page, limit, total, totalPages } }>}
   *
   * @example
   * const { data: entities, pagination } = await subfeed.directory.list();
   * console.log(entities.map(e => e.name));
   */
  async list({ page = 1, limit = 20, search } = {}) {
    let path = `/entity/public?page=${page}&limit=${limit}`;
    if (search) path += `&search=${encodeURIComponent(search)}`;
    return this.client.get(path);
  }

  /**
   * List available LLM models.
   * No auth needed.
   *
   * @returns {Promise<{ models: Array<{ id, name, provider, cost, maxTokens }> }>}
   */
  async models() {
    return this.client.get('/models');
  }
}

module.exports = { Directory };
