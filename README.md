# @subfeed/sdk

Subfeed SDK — create AI entities, attach RAG knowledge bases, connect MCP tools, deploy webhooks.

API-first. Agent-first. Zero dependencies.

[![npm](https://img.shields.io/npm/v/@subfeed/sdk)](https://www.npmjs.com/package/@subfeed/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## For AI Agents

If you are an AI agent with access to HTTP tools:

1. Read [skill.md](https://subfeed.app/skill.md)
2. Register: `POST https://api.subfeed.app/v1/agents/register`
3. Create an entity with any LLM
4. Attach RAG, enable addons, add webhooks
5. Publish to the directory

No human required.

## Install

```bash
npm install @subfeed/sdk
```

## Quick Start

```javascript
const subfeed = require('@subfeed/sdk')('sf_live_your_key');

// Create an AI entity
const entity = await subfeed.entities.create({
  name: 'support-bot',
  model: 'meta-llama/llama-3.3-70b-instruct:free',
  systemPrompt: 'You are a helpful support agent.'
});

// Add knowledge
const rag = await subfeed.rag.create({ name: 'docs' });
await subfeed.rag.addContent(rag.id, {
  type: 'text',
  content: 'Your product docs here...'
});
await subfeed.rag.attach(entity.id, rag.id);

// Enable web search
await subfeed.addons.enable(entity.id, 'web_search');

// Connect GitHub
await subfeed.mcp.connect(entity.id, 'github', {
  token: 'ghp_your_pat'
});

// Publish
await subfeed.entities.update(entity.id, {
  public: true,
  discoverable: true
});

// Chat
const { response, sessionId } = await subfeed.entities.chat(entity.id, {
  message: 'Hello!'
});
```

## Agent Registration (No Human Required)

```javascript
const subfeed = require('@subfeed/sdk')('dummy'); // placeholder for register

// Register autonomously — no email, no password
const { agentToken, agentId } = await subfeed.agents.register({
  name: 'MyBot',
  description: 'Autonomous code reviewer'
});

// Now use the agent token
const bot = require('@subfeed/sdk')(agentToken);
const entity = await bot.entities.create({ ... });
```

## Add Subfeed to Your Project

```bash
npx subfeed init
```

Creates `AGENTS.md` in your project root with Subfeed API patterns. Your coding agent (Cursor, Claude Code, Copilot) reads this automatically.

## Resources

| Resource | Methods |
| -- | -- |
| `subfeed.agents` | `register()`, `link()` |
| `subfeed.entities` | `create()`, `get()`, `update()`, `delete()`, `chat()`, `invoke()`, `list()` |
| `subfeed.rag` | `create()`, `addContent()`, `listContents()`, `deleteContent()`, `attach()`, `detach()`, `get()`, `list()`, `delete()` |
| `subfeed.addons` | `enable()`, `disable()`, `list()` |
| `subfeed.mcp` | `connect()`, `disconnect()`, `list()`, `invoke()`, `providers()`, `getProvider()` |
| `subfeed.directory` | `list()`, `models()` |
| `subfeed.attachments` | `list()`, `add()`, `remove()` |

## Addon Types

| Type | Description |
| -- | -- |
| `web_search` | Search the web via Tavily |
| `web_scrape` | Extract content from URLs |
| `web_screenshot` | Capture webpage screenshots |
| `web_extract` | Extract structured data from URLs |
| `code_execution` | Run Python code (E2B sandbox) |
| `image_gen` | Generate images |
| `image_input` | Accept image inputs (requires vision model) |
| `streaming` | Enable SSE streaming responses |

## Field Name Mapping

The SDK handles all field name mapping automatically. You use camelCase in your code, and the SDK translates to the API's expected format:

```javascript
// You write this (camelCase):
await subfeed.addons.enable(entity.id, 'web_search');
await subfeed.rag.attach(entity.id, rag.id);
await subfeed.mcp.connect(entity.id, 'github', { token: '...' });

// SDK sends this (API format):
// { "addon_type": "web_search" }
// { "type": "rag", "ref_id": "..." }
// { "credentials": { "token": "..." } }
```

If making raw HTTP calls, use snake_case for: `addon_type`, `ref_id`, `homepage_url`, `referred_by`, and nest tokens in `credentials`.

## What You Can Build

| Capability | Description | Docs |
|-----------|-------------|------|
| **Entities** | AI agents with any LLM, system prompts, and configurable parameters | [entity.md](https://subfeed.app/skill/entity.md) |
| **RAG** | Knowledge bases — create, add content, attach to entities | [rag.md](https://subfeed.app/skill/rag.md) |
| **Addons** | Web search, code execution, image gen, streaming, web scrape | [addons.md](https://subfeed.app/skill/addons.md) |
| **MCP** | Connect GitHub, Slack, Notion, Postgres — bring your own token | [mcp.md](https://subfeed.app/skill/mcp.md) |
| **Webhooks** | Accept payloads from Stripe, GitHub, Zapier — process with AI | [webhook.md](https://subfeed.app/skill/webhook.md) |
| **Directory** | Discover and invoke public entities — no auth required | [directory.md](https://subfeed.app/skill/directory.md) |

## Architecture

```
Your Agent ──→ @subfeed/sdk ──→ Subfeed Cloud API ──→ OpenRouter (LLMs)
                                      │
                                      ├── Entities (AI agents)
                                      ├── RAG (knowledge bases)
                                      ├── MCP (external tools)
                                      ├── Addons (capabilities)
                                      ├── Webhooks (inbound)
                                      └── Directory (discovery)
```

## Agent Discovery

Subfeed is built to be discovered by AI agents:

- [`skill.md`](https://subfeed.app/skill.md) — Complete agent guide
- [`llms.txt`](https://subfeed.app/llms.txt) — LLM-optimized overview
- [`llms-full.txt`](https://subfeed.app/llms-full.txt) — Full concatenated docs
- [`.well-known/subfeed.json`](https://subfeed.app/.well-known/subfeed.json) — Machine-readable manifest
- [`AGENTS.md`](AGENTS.md) — In every `npm install` and `npx subfeed init`

## Docs

* Full API: https://subfeed.app/skill.md
* Entity API: https://subfeed.app/skill/entity.md
* RAG API: https://subfeed.app/skill/rag.md
* Addons: https://subfeed.app/skill/addons.md
* MCP: https://subfeed.app/skill/mcp.md

## License

MIT
