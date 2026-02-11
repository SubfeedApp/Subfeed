/**
 * Entity Attachments
 *
 * Manage all attachment types (RAG, MCP, addons) on entities.
 * This is a lower-level API — prefer using subfeed.rag.attach(),
 * subfeed.addons.enable(), subfeed.mcp.connect() for convenience.
 *
 * SDK handles field mapping (sends ref_id, addon_type internally).
 *
 * Docs: https://subfeed.app/skill/entity.md
 */
class Attachments {
  constructor(client) { this.client = client; }

  /**
   * List all attachments on an entity.
   * Includes RAG connections, MCP providers, and enabled addons.
   *
   * @param {string} entityId - Entity UUID
   * @returns {Promise<Object>} Attachments with limits info
   */
  async list(entityId) {
    return this.client.get(`/entity/${entityId}/attachments`);
  }

  /**
   * Attach a resource to an entity.
   * SDK handles field mapping — you pass refId/addonType, SDK sends snake_case.
   *
   * @param {string} entityId - Entity UUID
   * @param {Object} options
   * @param {string} options.type - 'addon', 'rag', or 'mcp'
   * @param {string} [options.addonType] - Required if type='addon'
   * @param {string} [options.refId] - Required if type='rag' or 'mcp'
   * @returns {Promise<Object>} Attachment details
   */
  async add(entityId, { type, addonType, refId }) {
    const body = { type };
    if (addonType) body.addon_type = addonType;
    if (refId) body.ref_id = refId;
    return this.client.post(`/entity/${entityId}/attachments`, body);
  }

  /**
   * Remove an attachment from an entity.
   *
   * @param {string} entityId - Entity UUID
   * @param {string} attachmentId - Attachment UUID
   * @returns {Promise<Object>}
   */
  async remove(entityId, attachmentId) {
    return this.client.delete(`/entity/${entityId}/attachments/${attachmentId}`);
  }
}

module.exports = { Attachments };
