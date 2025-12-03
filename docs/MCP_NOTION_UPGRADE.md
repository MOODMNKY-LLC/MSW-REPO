# MCP Notion Server Upgrade Guide

## Overview

This guide explains how to configure the Notion MCP server to work with API version `2025-09-03` and resolve authentication issues.

## MCP Server Configuration

### Option 1: Using npx (Recommended)

Update your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-notion"
      ],
      "env": {
        "NOTION_API_KEY": "YOUR_NOTION_API_KEY_HERE",
        "NOTION_API_VERSION": "2025-09-03"
      }
    }
  }
}
```

### Option 2: Using Docker

If using Docker-based MCP:

```json
{
  "mcpServers": {
    "notion": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "NOTION_API_KEY=${NOTION_API_KEY}",
        "-e",
        "NOTION_API_VERSION=2025-09-03",
        "mcp/notion"
      ]
    }
  }
}
```

## Environment Variables

Set these environment variables:

```bash
# Windows PowerShell
$env:NOTION_API_KEY = "YOUR_NOTION_API_KEY_HERE"
$env:NOTION_API_VERSION = "2025-09-03"

# Linux/Mac
export NOTION_API_KEY="YOUR_NOTION_API_KEY_HERE"
export NOTION_API_VERSION="2025-09-03"
```

## Data Source IDs

The MCP server should automatically handle data source discovery, but you can also provide data source IDs directly from `.notion-config.json`.

## Testing MCP Connection

After configuring, test the connection:

1. **Restart Cursor IDE** to load new MCP configuration
2. **Use Cursor Chat** to test:
   ```
   "Query the MSW-REPO Academic Files database"
   ```
3. **Check for Errors**: If authentication fails, verify:
   - API key is correct
   - Integration has access to databases
   - API version is set to 2025-09-03

## Troubleshooting MCP Authentication

### Issue: 401 Unauthorized

**Solutions**:
1. Verify API key is correct in MCP config
2. Check integration has access to databases
3. Ensure `NOTION_API_VERSION` is set to `2025-09-03`
4. Restart Cursor IDE after configuration changes

### Issue: Database Not Found

**Solutions**:
1. Run migration script: `pnpm run migrate`
2. Verify database IDs in `.notion-config.json`
3. Ensure databases are shared with integration
4. Check data source IDs are present in config

### Issue: MCP Server Not Responding

**Solutions**:
1. Check MCP server is running
2. Verify command path is correct
3. Check environment variables are set
4. Review Cursor IDE logs for errors

## Integration Access

Ensure your SCHOLAR MNKY integration has access to:

- ✅ MSW H.Q. Teamspace
- ✅ All academic databases
- ✅ HUB page

To verify access:
1. Go to https://www.notion.so/my-integrations
2. Find "SCHOLAR MNKY" integration
3. Check "Connections" to see shared pages/databases

## Next Steps

1. ✅ Update MCP configuration
2. ✅ Set environment variables
3. ✅ Restart Cursor IDE
4. ⏳ Test MCP queries
5. ⏳ Verify all databases accessible

## Resources

- [Notion MCP Documentation](https://developers.notion.com/docs/notion-mcp)
- [MCP Server Notion](https://github.com/modelcontextprotocol/servers/tree/main/src/notion)
- [Notion API Upgrade Guide](https://developers.notion.com/docs/upgrade-guide-2025-09-03)

