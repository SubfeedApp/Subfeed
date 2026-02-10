/**
 * MCP (Model Context Protocol) Tool Connections
 *
 * Connect external tools to entities: GitHub, Slack, Notion, Postgres.
 * Bring Your Own Token (BYOT) — you provide the service's API token.
 * SDK handles field mapping (wraps token in credentials object internally).
 *
 * Docs: https://subfeed.app/skill/mcp.md
 */
class MCP {
  constructor(client) { this.client = client; }

  /**
   * Connect an MCP provider to an entity.
   * SDK handles field mapping — you pass { token }, SDK sends { credentials: { token } }.
   *
   * @param {string} entityId - Entity UUID
   * @param {string} provider - Provider name (e.g., 'github', 'slack', 'notion')
   * @param {Object} [options]
   * @param {string} [options.token] - Provider API token (BYOT)
   * @param {string} [options.serverUrl] - Custom MCP server URL (for self-hosted)
   * @returns {Promise<{ providerId: string, connected: boolean, tools: Array }>}
   *
   * @example
   * await subfeed.mcp.connect(entity.id, 'github', {
   *   token: 'ghp_your_github_pat'
   * });
   */
  async connect(entityId, provider, { token, serverUrl } = {}) {
    const body = {};
    if (serverUrl) body.serverUrl = serverUrl;
    if (token) body.credentials = { token };
    return this.client.post(`/entity/${entityId}/mcp/${provider}`, body);
  }

  /**
   * List connected providers for an entity.
   * @param {string} entityId - Entity UUID
   * @returns {Promise<Array<{ providerId: string, provider: string, tools: Array, connected: boolean }>>}
   */
  async list(entityId) {
    return this.client.get(`/entity/${entityId}/mcp`);
  }

  /**
   * Disconnect a provider.
   * @param {string} entityId - Entity UUID
   * @param {string} provider - Provider name
   * @returns {Promise<{ disconnected: boolean, provider_id: string }>}
   */
  async disconnect(entityId, provider) {
    return this.client.delete(`/entity/${entityId}/mcp/${provider}`);
  }

  /**
   * Invoke an MCP tool directly.
   *
   * @param {string} entityId - Entity UUID
   * @param {string} provider - Provider name
   * @param {Object} options
   * @param {string} options.tool - Tool name to invoke
   * @param {Object} [options.params] - Tool parameters
   * @returns {Promise<{ success: boolean, result: any }>}
   *
   * @example
   * const result = await subfeed.mcp.invoke(entity.id, 'github', {
   *   tool: 'list_repositories',
   *   params: { per_page: 10 }
   * });
   */
  async invoke(entityId, provider, { tool, params } = {}) {
    return this.client.post(`/entity/${entityId}/mcp/${provider}/invoke`, { tool, params });
  }

  /**
   * List all available MCP providers.
   * No auth needed.
   * @returns {Promise<{ providers: Array }>}
   */
  async providers() {
    return this.client.get('/mcp/providers');
  }

  /**
   * Get details for a specific MCP provider.
   * No auth needed.
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} Provider details
   */
  async getProvider(providerId) {
    return this.client.get(`/mcp/providers/${providerId}`);
  }
}

module.exports = { MCP };
