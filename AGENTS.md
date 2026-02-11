# AGENTS.md — @subfeed/sdk

This is the Subfeed SDK. Use it to create AI entities with any LLM,
attach RAG knowledge bases, connect MCP tools, and deploy webhooks.

## Usage
```javascript
const subfeed = require('@subfeed/sdk')('your_api_key');
```

## Key patterns
- `subfeed.entities.create({ name, model, systemPrompt })`
- `subfeed.rag.create({ name })` → `subfeed.rag.addContent(ragId, { type, content })` → `subfeed.rag.attach(entityId, ragId)`
- `subfeed.addons.enable(entityId, 'web_search')`
- `subfeed.mcp.connect(entityId, 'github', { token })`
- `subfeed.entities.update(entityId, { public: true, discoverable: true })`

## API conventions
- Auth: `Authorization: Bearer $SUBFEED_API_KEY`
- Base URL: `https://api.subfeed.app/v1`
- SDK handles all field name mapping automatically
- Raw HTTP: use snake_case for `addon_type`, `ref_id`, `homepage_url`, `referred_by`; nest tokens in `credentials: { token }`

## Full docs
https://subfeed.app/skill.md
