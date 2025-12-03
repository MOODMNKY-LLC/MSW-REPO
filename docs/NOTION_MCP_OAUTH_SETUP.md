# Notion MCP OAuth Setup Guide

## Overview

Notion provides **two ways** to connect to Notion via MCP:

1. **Official Notion Hosted MCP** (OAuth-based) - Recommended for Cursor
2. **Open-Source MCP Server** (API key-based) - Alternative option

Based on the [Notion MCP documentation](https://developers.notion.com/docs/mcp), the official hosted MCP uses **OAuth authentication**, not API keys.

## Option 1: Official Notion Hosted MCP (OAuth) - Recommended

### What is Notion Hosted MCP?

Notion's hosted MCP server provides:
- ✅ **Easy OAuth setup** - One-click installation
- ✅ **Full workspace access** - AI tools can read and write like you
- ✅ **Optimized for AI** - Built specifically for AI agents
- ✅ **Secure** - OAuth 2.1 authentication

### How to Connect

According to [Notion's MCP documentation](https://developers.notion.com/docs/mcp):

1. **Search for "Notion MCP"** in Cursor's MCP directory
2. **Click "Connect"** - This will initiate OAuth flow
3. **Authorize** - Grant access to your Notion workspace
4. **Done** - MCP server is now connected

### Cursor Configuration

If Cursor supports Notion's hosted MCP, the configuration should be:

```json
{
  "mcpServers": {
    "notion": {
      "url": "https://mcp.notion.so",
      "transport": "sse",
      "auth": {
        "type": "oauth",
        "clientId": "notion-mcp-client",
        "authorizationUrl": "https://notion.so/oauth/authorize",
        "tokenUrl": "https://notion.so/oauth/token"
      }
    }
  }
}
```

**Note**: The exact configuration depends on how Cursor implements OAuth for MCP servers. Check Cursor's MCP documentation for the specific format.

### Benefits of OAuth Approach

- ✅ No API keys to manage
- ✅ Automatic token refresh
- ✅ Better security
- ✅ Workspace-level permissions
- ✅ One-click setup

## Option 2: Open-Source Notion MCP Server (API Key)

If Cursor doesn't support OAuth-based MCP or you prefer API key authentication, you can use the open-source Notion MCP server.

### Configuration

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

### Installation

The open-source server uses `@modelcontextprotocol/server-notion` package and requires:
- `NOTION_API_KEY` environment variable
- API version `2025-09-03` for compatibility

## Option 3: Direct API Calls (Current Setup)

Your current setup uses direct API calls via `@notionhq/client` SDK. This works well for:
- ✅ Scripts and automation
- ✅ File syncing
- ✅ Programmatic access
- ✅ Custom integrations

**This is separate from MCP** and doesn't require MCP server configuration.

## Which Option Should You Use?

### Use Official Notion Hosted MCP (OAuth) if:
- ✅ Cursor supports OAuth-based MCP servers
- ✅ You want one-click setup
- ✅ You prefer OAuth over API keys
- ✅ You want workspace-level access

### Use Open-Source MCP Server if:
- ✅ Cursor doesn't support OAuth MCP
- ✅ You prefer API key authentication
- ✅ You need more control over the server
- ✅ You're already using API keys

### Use Direct API Calls if:
- ✅ You're writing scripts (not using MCP)
- ✅ You need programmatic access
- ✅ You're building custom integrations
- ✅ MCP isn't necessary for your use case

## Current Setup Analysis

Your current setup uses **Option 3 (Direct API Calls)**:
- ✅ `@notionhq/client` SDK v5.4.0
- ✅ API version `2025-09-03`
- ✅ API key authentication
- ✅ Scripts for database operations

**This is working correctly** for script-based operations. The MCP server would be an **additional** way to access Notion through Cursor chat.

## Troubleshooting MCP Authentication

### If Using Official Notion Hosted MCP:

1. **Check Cursor Support**: Verify Cursor supports OAuth-based MCP servers
2. **Check MCP Directory**: Look for "Notion MCP" in Cursor's MCP directory
3. **OAuth Flow**: Follow the OAuth authorization flow
4. **Verify Connection**: Test with a simple query

### If Using Open-Source MCP Server:

1. **Verify Package**: Ensure `@modelcontextprotocol/server-notion` is available
2. **Check API Key**: Verify `NOTION_API_KEY` is set correctly
3. **Check API Version**: Ensure `NOTION_API_VERSION` is `2025-09-03`
4. **Test Connection**: Try a simple MCP query

### Common Issues

**Issue**: MCP server not found
- **Solution**: Check if Cursor supports remote MCP servers
- **Alternative**: Use open-source server with npx

**Issue**: OAuth not working
- **Solution**: Check Cursor's OAuth implementation
- **Alternative**: Use API key-based open-source server

**Issue**: 401 Unauthorized
- **Solution**: Verify API key is correct (for open-source server)
- **Solution**: Re-authorize OAuth (for hosted MCP)

## Next Steps

1. **Check Cursor MCP Support**: 
   - Open Cursor settings
   - Look for MCP configuration
   - Check if "Notion MCP" appears in directory

2. **Try OAuth Connection**:
   - If available, use official Notion hosted MCP
   - Follow OAuth flow

3. **Fallback to API Key**:
   - If OAuth not available, use open-source server
   - Configure with API key

4. **Test Both Approaches**:
   - Test OAuth if available
   - Test API key server as backup
   - Use whichever works best

## Resources

- [Notion MCP Documentation](https://developers.notion.com/docs/mcp)
- [Connecting to Notion MCP](https://developers.notion.com/docs/get-started-with-mcp)
- [Supported Tools](https://developers.notion.com/docs/mcp-supported-tools)
- [Cursor MCP Documentation](https://cursor.com/docs/context/mcp)
- [Open-Source Notion MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/notion)

## Summary

- **Official Notion MCP**: Uses OAuth, hosted by Notion, one-click setup
- **Open-Source MCP**: Uses API keys, self-hosted, more control
- **Direct API Calls**: Current setup, works for scripts, separate from MCP

Your current direct API setup is working fine. MCP would add Cursor chat integration as an additional capability.

