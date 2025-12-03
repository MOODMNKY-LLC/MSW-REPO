# Notion MCP Quick Start Guide

## TL;DR - Fastest Setup

**Recommended**: Use the official Notion hosted MCP with OAuth.

### Step 1: Add to Cursor MCP Config

Create or edit `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "Notion": {
      "url": "https://mcp.notion.com/mcp"
    }
  }
}
```

### Step 2: Restart Cursor

Close and reopen Cursor IDE.

### Step 3: Connect via Notion App (Easiest)

1. Open Notion app
2. Go to **Settings** → **Connections** → **Notion MCP**
3. Choose **Cursor**
4. Complete OAuth flow

### Step 4: Test

In Cursor chat, try:
```
"Search my Notion workspace for databases"
```

## Alternative Methods

### If Streamable HTTP Doesn't Work

**Try SSE**:
```json
{
  "mcpServers": {
    "Notion": {
      "type": "sse",
      "url": "https://mcp.notion.com/sse"
    }
  }
}
```

**Or STDIO**:
```json
{
  "mcpServers": {
    "notionMCP": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
    }
  }
}
```

### If OAuth Doesn't Work

Use open-source server with API key:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "YOUR_NOTION_API_KEY_HERE",
        "NOTION_API_VERSION": "2025-09-03"
      }
    }
  }
}
```

## Full Documentation

- **Official Setup**: `docs/NOTION_MCP_OFFICIAL_SETUP.md`
- **OAuth vs API Key**: `docs/NOTION_MCP_OAUTH_SETUP.md`
- **API Upgrade**: `docs/NOTION_API_UPGRADE.md`

## Troubleshooting

**MCP not connecting?**
- Check Cursor supports remote MCP servers
- Try STDIO method as fallback
- Verify internet connection

**OAuth not working?**
- Connect through Notion app instead
- Or use API key method

**Still having issues?**
- Run: `cd tools/notion-integration && pnpm run test-mcp`
- Check: `docs/NOTION_MCP_OFFICIAL_SETUP.md`

---

**Reference**: [Notion MCP Getting Started](https://developers.notion.com/docs/get-started-with-mcp)

