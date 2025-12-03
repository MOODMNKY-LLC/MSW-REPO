# Official Notion MCP Setup Guide

Based on the [official Notion MCP documentation](https://developers.notion.com/docs/get-started-with-mcp), this guide provides step-by-step instructions for connecting Cursor to Notion MCP.

## Overview

Notion MCP is a **hosted server** that uses **OAuth authentication**. It provides secure access to your Notion workspace through AI tools like Cursor.

**Key Features**:
- ✅ OAuth-based authentication (no API keys needed)
- ✅ Hosted by Notion (no local server required)
- ✅ Full workspace access
- ✅ Optimized for AI agents

## Connection Methods

Notion MCP supports three connection methods. Choose the one that works best with Cursor:

### Method 1: Streamable HTTP (Recommended)

This is the recommended method for most MCP clients.

**Configuration** (`~/.cursor/mcp.json` or `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "Notion": {
      "url": "https://mcp.notion.com/mcp"
    }
  }
}
```

### Method 2: SSE (Server-Sent Events)

Alternative method using Server-Sent Events.

**Configuration**:

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

### Method 3: STDIO (Local Server)

Uses a local proxy server via `mcp-remote`.

**Configuration**:

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

## Step-by-Step Setup

### Option A: Connect Through Notion App (Easiest)

1. **Open Notion App**
   - Go to **Settings** → **Connections** → **Notion MCP**

2. **Choose Your AI Tool**
   - Select **Cursor** from the list

3. **Complete OAuth Flow**
   - Authorize Cursor to access your Notion workspace
   - Grant necessary permissions

4. **Done!**
   - Cursor should now be connected to Notion MCP

### Option B: Connect Through Cursor (Manual)

1. **Open Cursor Settings**
   - Go to Cursor settings/preferences
   - Navigate to MCP configuration

2. **Add Notion MCP**
   - Search for "Notion MCP" in Cursor's MCP directory
   - Or manually add the configuration

3. **Configure Connection**
   - Use Method 1 (Streamable HTTP) configuration above
   - Save the configuration

4. **Restart Cursor**
   - Close and reopen Cursor to load the new MCP server

5. **Authorize Connection**
   - When prompted, complete the OAuth flow
   - Grant access to your Notion workspace

### Option C: Manual Configuration File

If Cursor doesn't have a UI for MCP configuration:

1. **Locate MCP Config File**
   - Check `~/.cursor/mcp.json` or `.cursor/mcp.json` in your workspace

2. **Add Notion MCP Configuration**
   ```json
   {
     "mcpServers": {
       "Notion": {
         "url": "https://mcp.notion.com/mcp"
       }
     }
   }
   ```

3. **Restart Cursor**
   - Close and reopen Cursor

4. **Complete OAuth**
   - Follow OAuth prompts when using Notion MCP tools

## Verification

After setup, test the connection:

1. **Use Cursor Chat**
   - Ask: "Search my Notion workspace for pages about assignments"
   - Or: "List all databases in my Notion workspace"

2. **Check MCP Tools**
   - Notion MCP provides tools like:
     - `notion-search` - Search across workspace
     - `notion-fetch` - Retrieve page content
     - `notion-create-pages` - Create new pages
     - `notion-update-page` - Update existing pages
     - And more...

## Troubleshooting

### Issue: MCP Server Not Found

**Solution**:
- Verify Cursor supports remote MCP servers
- Check if Cursor has MCP client capability
- Try Method 3 (STDIO) as fallback

### Issue: OAuth Not Working

**Solution**:
- Ensure you're using the official hosted MCP (`https://mcp.notion.com/mcp`)
- Check Cursor's OAuth implementation
- Try connecting through Notion app instead

### Issue: Connection Timeout

**Solution**:
- Check internet connection
- Verify URL is correct: `https://mcp.notion.com/mcp`
- Try SSE method instead: `https://mcp.notion.com/sse`

### Issue: Cursor Doesn't Support Remote MCP

**Solution**:
- Use Method 3 (STDIO) with `mcp-remote`
- Or use the open-source Notion MCP server with API keys
- See `docs/NOTION_MCP_OAUTH_SETUP.md` for alternative options

## Alternative: Open-Source MCP Server

If the official hosted MCP doesn't work with Cursor, you can use the open-source server:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "your_api_key_here",
        "NOTION_API_VERSION": "2025-09-03"
      }
    }
  }
}
```

**Note**: This requires an API key and uses direct API calls instead of OAuth.

## What You Can Do with Notion MCP

Once connected, you can use Cursor chat to:

- **Search**: "Find all pages mentioning 'SOCW-6510'"
- **Create**: "Create a new assignment page in the Assignments database"
- **Update**: "Update the status of Assignment 01 to Completed"
- **Fetch**: "Get the content of the HUB page"
- **Manage**: "List all databases in my workspace"

## Resources

- [Official Notion MCP Documentation](https://developers.notion.com/docs/mcp)
- [Connecting to Notion MCP](https://developers.notion.com/docs/get-started-with-mcp)
- [Supported Tools](https://developers.notion.com/docs/mcp-supported-tools)
- [Security Best Practices](https://developers.notion.com/docs/mcp-security-best-practices)
- [Cursor MCP Documentation](https://cursor.com/docs/context/mcp)

## Summary

**Recommended Setup**:
1. Use Method 1 (Streamable HTTP) with `https://mcp.notion.com/mcp`
2. Connect through Notion app for easiest OAuth flow
3. Or configure manually in Cursor's MCP settings
4. Test with a simple search query

**If Official MCP Doesn't Work**:
- Try Method 3 (STDIO) with `mcp-remote`
- Or use open-source server with API keys
- Your direct API integration will continue to work regardless

---

**Last Updated**: December 3, 2025
**Based on**: [Notion MCP Getting Started Guide](https://developers.notion.com/docs/get-started-with-mcp)

