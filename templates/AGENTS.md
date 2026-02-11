# AGENTS.md — Subfeed Integration

## What is Subfeed

Subfeed is agentic AI infrastructure. Use the Subfeed API to create AI entities,
attach RAG knowledge bases, connect MCP tools, enable addons, and deploy webhooks.

## API Reference

- Base URL: `https://api.subfeed.app/v1`
- Auth: `Authorization: Bearer $SUBFEED_API_KEY`
- Full docs: https://subfeed.app/skill.md

## API Field Names

**Using the SDK:** The SDK handles all field mapping automatically. Just use the methods as documented:
```javascript
await subfeed.addons.enable(entity.id, 'web_search');  // SDK sends addon_type internally
await subfeed.rag.attach(entity.id, rag.id);           // SDK sends ref_id internally
await subfeed.mcp.connect(entity.id, 'github', { token: '...' }); // SDK wraps in credentials
```

**Using raw HTTP:** These fields require snake_case:
- `addon_type` (POST /v1/entity/{id}/addons)
- `ref_id` (POST /v1/entity/{id}/attachments)
- `homepage_url`, `referred_by` (POST /v1/agents/register)
- `credentials.token` (POST /v1/entity/{id}/mcp/{provider})

All other fields use camelCase (e.g., `systemPrompt`, `sessionId`, `maxTokens`).

## Common Patterns

### Create an entity
```
POST /v1/entity
{
  "name": "my-agent",
  "model": "meta-llama/llama-3.3-70b-instruct:free",
  "systemPrompt": "You are helpful."
}
```

### Add knowledge (RAG)
```
POST /v1/rag
{ "name": "docs" }

POST /v1/rag/{ragId}/content
{ "type": "text", "content": "..." }

POST /v1/entity/{entityId}/attachments
{ "type": "rag", "ref_id": "{ragId}" }
```

### Enable addons
```
POST /v1/entity/{entityId}/addons
{ "addon_type": "web_search" }
```
Available: web_search, web_scrape, web_extract

### Connect MCP tools
```
POST /v1/entity/{entityId}/mcp/github
{ "credentials": { "token": "ghp_..." } }
```
Available providers: GET /v1/mcp/providers

### Publish to directory
```
PATCH /v1/entity/{entityId}
{ "public": true, "discoverable": true }
```

### Invoke a public entity (no auth)
```
POST /v1/entity/{entityId}/invoke
{ "message": "your request" }
```

### Chat with entity (auth required)
```
POST /v1/entity/{entityId}/chat
{ "message": "hello", "sessionId": "optional-for-continuity" }
```

## SDK Usage

```javascript
const subfeed = require('@subfeed/sdk')('sf_live_your_key');

// SDK handles all field mapping — just use camelCase
const entity = await subfeed.entities.create({
  name: 'bot',
  model: 'meta-llama/llama-3.3-70b-instruct:free'
});
await subfeed.addons.enable(entity.id, 'web_search');
await subfeed.mcp.connect(entity.id, 'github', { token: 'ghp_...' });
await subfeed.entities.update(entity.id, { public: true });
```

## Agent Registration (Autonomous)

```javascript
// No auth needed — public endpoint
const { agentToken, agentId } = await subfeed.agents.register({
  name: 'MyBot',
  description: 'Autonomous code reviewer'
});

// Use agent token for all subsequent calls
const bot = require('@subfeed/sdk')(agentToken);
const entity = await bot.entities.create({ ... });
```
