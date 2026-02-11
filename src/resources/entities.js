/**
 * Entity Management
 *
 * Create and manage AI agents (entities) on Subfeed.
 * Each entity has a model, system prompt, and optional RAG/addons/MCP.
 *
 * Docs: https://subfeed.app/skill/entity.md
 */
class Entities {
  constructor(client) { this.client = client; }

  /**
   * Create a new entity.
   *
   * @param {Object} options
   * @param {string} options.name - Entity name (1-255 chars, required)
   * @param {string} [options.model] - LLM model (e.g., 'meta-llama/llama-3.3-70b-instruct:free')
   * @param {string} [options.systemPrompt] - System prompt instructions
   * @param {string} [options.description] - Public description
   * @param {string} [options.personality] - Personality preset
   * @param {number} [options.temperature] - Temperature (0-2)
   * @param {number} [options.topP] - Top-p sampling (0-1)
   * @param {number} [options.topK] - Top-k sampling
   * @param {number} [options.maxTokens] - Max output tokens (1-128000)
   * @param {number} [options.frequencyPenalty] - Frequency penalty (-2 to 2)
   * @param {number} [options.presencePenalty] - Presence penalty (-2 to 2)
   * @param {string} [options.tier] - Entity tier: 'nano', 'micro', 'small'
   * @param {boolean} [options.public] - Make publicly invokable (default: false)
   * @param {boolean} [options.discoverable] - Show in directory (default: false)
   * @returns {Promise<Object>} Created entity with id, invoke_url (if public), etc.
   *
   * @example
   * const entity = await subfeed.entities.create({
   *   name: 'support-bot',
   *   model: 'meta-llama/llama-3.3-70b-instruct:free',
   *   systemPrompt: 'You are a helpful support agent.'
   * });
   */
  async create(options) {
    return this.client.post('/entity', options);
  }

  /**
   * Get entity by ID.
   * @param {string} id - Entity UUID
   * @returns {Promise<Object>} Entity details
   */
  async get(id) {
    return this.client.get(`/entity/${id}`);
  }

  /**
   * Update entity.
   *
   * @param {string} id - Entity UUID
   * @param {Object} updates - Fields to update
   * @param {string} [updates.name] - New name
   * @param {string} [updates.model] - New model
   * @param {string} [updates.systemPrompt] - New system prompt
   * @param {string} [updates.status] - 'active' or 'paused'
   * @param {boolean} [updates.public] - Make entity publicly invokable
   * @param {boolean} [updates.discoverable] - Show in directory
   * @returns {Promise<Object>} Updated entity
   *
   * @example
   * // Publish to directory
   * await subfeed.entities.update(entity.id, {
   *   public: true,
   *   discoverable: true
   * });
   */
  async update(id, updates) {
    return this.client.patch(`/entity/${id}`, updates);
  }

  /**
   * Delete entity.
   * @param {string} id - Entity UUID
   * @returns {Promise<{ message: string }>}
   */
  async delete(id) {
    return this.client.delete(`/entity/${id}`);
  }

  /**
   * Chat with entity (authenticated, session-based).
   *
   * @param {string} id - Entity UUID
   * @param {Object} options
   * @param {string} options.message - User message (1-100000 chars)
   * @param {string} [options.sessionId] - Session ID for conversation continuity
   * @param {string} [options.model] - Model override for this request
   * @param {boolean} [options.stream] - Enable SSE streaming (requires streaming addon)
   * @param {string[]} [options.images] - Image URLs or base64 data URLs (max 5, requires image_input addon)
   * @returns {Promise<{ response: string, sessionId: string, requestId: string, usage: Object }>}
   *
   * @example
   * const { response, sessionId } = await subfeed.entities.chat(entity.id, {
   *   message: 'Hello, how are you?'
   * });
   * // Continue conversation
   * const { response: reply } = await subfeed.entities.chat(entity.id, {
   *   message: 'Tell me more',
   *   sessionId
   * });
   */
  async chat(id, options) {
    return this.client.post(`/entity/${id}/chat`, options);
  }

  /**
   * Invoke a public entity (no auth needed for public entities).
   *
   * @param {string} id - Entity UUID
   * @param {Object} options
   * @param {string} options.message - User message
   * @param {string} [options.sessionId] - Session ID for conversation continuity
   * @returns {Promise<{ response: string, sessionId: string, entityId: string }>}
   *
   * @example
   * // No API key needed for public entities
   * const { response } = await subfeed.entities.invoke(entity.id, {
   *   message: 'Review this code for security issues'
   * });
   */
  async invoke(id, options) {
    const res = await fetch(`${this.client.baseUrl}/entity/${id}/invoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Invoke failed');
    return json.data;
  }

  /**
   * List all your entities.
   * @param {Object} [options]
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.limit=10] - Items per page
   * @returns {Promise<Array>} List of entities
   */
  async list({ page = 1, limit = 10 } = {}) {
    return this.client.get(`/entity?page=${page}&limit=${limit}`);
  }
}

module.exports = { Entities };
