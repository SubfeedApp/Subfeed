/**
 * RAG Knowledge Bases
 *
 * Create knowledge bases, add content, and attach to entities.
 * Entities with RAG answer from your data, not hallucinations.
 *
 * Features:
 * - Hybrid search (dense + sparse vectors)
 * - Reranking for relevance
 * - Chunk expansion for context
 *
 * Docs: https://subfeed.app/skill/rag.md
 */
class RAG {
  constructor(client) { this.client = client; }

  /**
   * Create a new knowledge base.
   *
   * @param {Object} options
   * @param {string} options.name - Knowledge base name (1-100 chars)
   * @param {string} [options.description] - Description (max 500 chars)
   * @returns {Promise<Object>} Created RAG with id, storage_used, storage_limit, etc.
   *
   * @example
   * const rag = await subfeed.rag.create({ name: 'product-docs' });
   */
  async create(options) {
    return this.client.post('/rag', options);
  }

  /**
   * Add text content to a knowledge base.
   *
   * @param {string} ragId - RAG UUID
   * @param {Object} options
   * @param {string} options.type - Content type ('text')
   * @param {string} options.content - Text content to add
   * @param {string} [options.name] - Content name (max 255 chars)
   * @returns {Promise<Object>} Created content with id, contentSize, chunkCount
   *
   * @example
   * await subfeed.rag.addContent(rag.id, {
   *   type: 'text',
   *   content: 'Your product documentation here...'
   * });
   */
  async addContent(ragId, options) {
    return this.client.post(`/rag/${ragId}/content`, options);
  }

  /**
   * List contents in a knowledge base.
   * @param {string} ragId - RAG UUID
   * @returns {Promise<Array>} List of content items
   */
  async listContents(ragId) {
    return this.client.get(`/rag/${ragId}/content`);
  }

  /**
   * Delete content from a knowledge base.
   * @param {string} ragId - RAG UUID
   * @param {string} contentId - Content UUID
   * @returns {Promise<Object>}
   */
  async deleteContent(ragId, contentId) {
    return this.client.delete(`/rag/${ragId}/content/${contentId}`);
  }

  /**
   * Attach a knowledge base to an entity.
   * SDK handles field mapping (sends ref_id internally).
   *
   * @param {string} entityId - Entity UUID
   * @param {string} ragId - RAG UUID
   * @returns {Promise<Object>} Attachment details
   *
   * @example
   * await subfeed.rag.attach(entity.id, rag.id);
   */
  async attach(entityId, ragId) {
    return this.client.post(`/entity/${entityId}/attachments`, {
      type: 'rag',
      ref_id: ragId,
    });
  }

  /**
   * Detach a knowledge base from an entity.
   * @param {string} entityId - Entity UUID
   * @param {string} attachmentId - Attachment UUID (from attach response)
   * @returns {Promise<Object>}
   */
  async detach(entityId, attachmentId) {
    return this.client.delete(`/entity/${entityId}/attachments/${attachmentId}`);
  }

  /**
   * Get knowledge base by ID.
   * @param {string} ragId - RAG UUID
   * @returns {Promise<Object>} RAG details
   */
  async get(ragId) {
    return this.client.get(`/rag/${ragId}`);
  }

  /**
   * List all knowledge bases.
   * @returns {Promise<{ rags: Array }>}
   */
  async list() {
    return this.client.get('/rag');
  }

  /**
   * Delete knowledge base.
   * @param {string} ragId - RAG UUID
   * @returns {Promise<{ deleted: boolean }>}
   */
  async delete(ragId) {
    return this.client.delete(`/rag/${ragId}`);
  }
}

module.exports = { RAG };
