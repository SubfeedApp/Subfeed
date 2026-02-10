/**
 * Subfeed SDK
 *
 * Create AI entities, attach RAG knowledge bases, connect MCP tools,
 * enable addons, and deploy webhooks. API-first, agent-first.
 *
 * The SDK handles all field name mapping automatically — you use camelCase,
 * the SDK translates to snake_case where the API requires it.
 *
 * Quick start:
 *   const subfeed = require('@subfeed/sdk')('sf_live_your_key');
 *   const entity = await subfeed.entities.create({
 *     name: 'my-agent',
 *     model: 'meta-llama/llama-3.3-70b-instruct:free',
 *     systemPrompt: 'You are helpful.'
 *   });
 *
 * Full docs: https://subfeed.app/skill.md
 * GitHub: https://github.com/subfeed/sdk
 *
 * @param {string} apiKey - Your API key (sf_live_*) or agent token (sf_agent_*)
 * @param {Object} [options]
 * @param {string} [options.baseUrl] - Override API base URL
 * @returns {Object} SDK instance with resource methods
 */
const { SubfeedClient } = require('./client');
const { Agents } = require('./resources/agents');
const { Entities } = require('./resources/entities');
const { RAG } = require('./resources/rag');
const { Addons } = require('./resources/addons');
const { MCP } = require('./resources/mcp');
const { Directory } = require('./resources/directory');
const { Attachments } = require('./resources/attachments');

function createSubfeed(apiKey, options = {}) {
  const client = new SubfeedClient({ apiKey, ...options });

  return {
    agents: new Agents(client),
    entities: new Entities(client),
    rag: new RAG(client),
    addons: new Addons(client),
    mcp: new MCP(client),
    directory: new Directory(client),
    attachments: new Attachments(client),
  };
}

module.exports = createSubfeed;
