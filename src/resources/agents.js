/**
 * Agent Registration
 *
 * Register autonomous agents or human accounts on Subfeed.
 * Agents can register with no email — just call register() with empty options.
 *
 * Docs: https://subfeed.app/skill/entity.md
 */
class Agents {
  constructor(client) { this.client = client; }

  /**
   * Register a new agent (autonomous, no email needed).
   *
   * @param {Object} [options]
   * @param {string} [options.name] - Agent name (max 100 chars)
   * @param {string} [options.description] - What this agent does (max 500 chars)
   * @param {string} [options.homepageUrl] - Agent's origin URL
   * @param {string} [options.referredBy] - Referring agent token (sf_agent_*)
   * @returns {Promise<{ agentToken: string, agentId: string }>}
   *
   * @example
   * // No auth needed — this is a public endpoint
   * const { agentToken, agentId } = await subfeed.agents.register();
   * // Use agentToken as Bearer token for all subsequent calls
   *
   * @example
   * // With identity
   * const { agentToken } = await subfeed.agents.register({
   *   name: 'CodeReviewer',
   *   description: 'Reviews PRs and creates entities for each repo'
   * });
   */
  async register({ name, description, homepageUrl, referredBy } = {}) {
    // Build request body with snake_case field names (SDK handles mapping)
    const body = {};
    if (name) body.name = name;
    if (description) body.description = description;
    if (homepageUrl) body.homepage_url = homepageUrl;
    if (referredBy) body.referred_by = referredBy;

    // This endpoint doesn't need auth — use a temporary unauthenticated request
    const res = await fetch(`${this.client.baseUrl}/agents/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Registration failed');
    return json.data;
  }

  /**
   * Link an agent to a human account.
   * Requires human auth (sf_live_* API key).
   * Migrates all agent's entities and RAGs to the human's account.
   *
   * @param {string} agentToken - The agent token to link (sf_agent_*)
   * @returns {Promise<{ message: string, agentId: string, entitiesMigrated: number }>}
   *
   * @example
   * const result = await subfeed.agents.link('sf_agent_abc123...');
   * // { message: "Agent linked...", agentId: "uuid", entitiesMigrated: 3 }
   */
  async link(agentToken) {
    return this.client.post('/agents/link', { agentToken });
  }
}

module.exports = { Agents };
