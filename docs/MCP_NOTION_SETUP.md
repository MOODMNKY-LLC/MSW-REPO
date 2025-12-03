# Setting Up Notion Integration via MCP Server

> **⚠️ DEPRECATED**: This guide describes the legacy API key-based MCP setup. The **primary method** is now the **Official Notion Hosted MCP** (OAuth). See [Official Notion MCP Setup](./NOTION_MCP_OFFICIAL_SETUP.md) for the current recommended approach.

> **Current Status**: Official Notion MCP (OAuth) is already connected and working. This guide is kept for reference only.

---

This guide walks you through setting up the Notion integration using the legacy API key-based MCP server. **Note**: The Official Notion Hosted MCP (OAuth) is now the primary method.

## Prerequisites

- Cursor IDE with MCP servers enabled
- Notion account
- Access to create integrations in Notion

## Step 1: Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Choose **"Internal"** integration type
4. Name it: **"MSW-REPO Integration"**
5. Set capabilities:
   - ✅ Read content
   - ✅ Insert content
   - ✅ Update content
   - ✅ Read comments (optional)
6. Click **"Submit"**
7. **Copy the "Internal Integration Token"** - you'll need this

## Step 2: Configure MCP Server

The Notion MCP server should already be configured in `.cursor/mcp.json`. Verify it looks like:

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
        "mcp/notion"
      ]
    }
  }
}
```

## Step 3: Set Environment Variable

Set the `NOTION_API_KEY` environment variable:

### Windows (PowerShell):
```powershell
$env:NOTION_API_KEY = "your_integration_token_here"
```

### Windows (Command Prompt):
```cmd
set NOTION_API_KEY=your_integration_token_here
```

### Linux/Mac:
```bash
export NOTION_API_KEY=your_integration_token_here
```

**For persistent setup**, add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.) or use a `.env` file.

## Step 4: Share Workspace with Integration

1. Open your Notion workspace
2. Click **"Settings & members"** → **"Connections"**
3. Find **"MSW-REPO Integration"**
4. Click **"Add"** or **"Connect"**
5. Grant access to pages/databases you want to use

## Step 5: Create Database via MCP

Now you can use Cursor's chat interface with the Notion MCP server to:

### Option A: Use Cursor Chat

Ask Cursor:
```
"Search for databases in my Notion workspace"
```

Then:
```
"Create a new database called 'MSW-REPO Academic Files' with these properties:
- Title (title)
- Course (select) with options: SOCW-6510
- Type (select) with options: Assignment, Paper, Article, Note, Research, Project, Document
- Status (select) with options: Draft, In Progress, Completed, Submitted, Archived
- Due Date (date)
- Tags (multi-select)
- File Path (text)"
```

### Option B: Use the Setup Script

The script in `tools/notion-integration/scripts/setup-notion-database.js` contains the schema configuration. You can reference it when asking Cursor to create the database.

## Step 6: Verify Setup

Test the integration by asking Cursor:
```
"List all databases in my Notion workspace"
```

Or:
```
"Query the MSW-REPO Academic Files database"
```

## Database Schema Reference

The complete database schema is defined in:
- `tools/notion-integration/config/notion-schema.json`
- `tools/notion-integration/scripts/setup-notion-database.js`

### Required Properties:

1. **Title** (Title) - File/document name
2. **Course** (Select) - Course codes (SOCW-6510, etc.)
3. **Type** (Select) - Document type
4. **Category** (Select) - Category based on file location
5. **Status** (Select) - Current status
6. **Due Date** (Date) - For assignments
7. **Tags** (Multi-select) - For categorization
8. **File Path** (Rich Text) - Path to file in repository

## Using MCP Server for Operations

Once set up, you can use Cursor chat to:

### Create Database Entries:
```
"Create a new entry in MSW-REPO Academic Files database:
Title: Assignment 01
Course: SOCW-6510
Type: Assignment
Status: In Progress
File Path: courses/SOCW-6510/assignments/assignment-01.md"
```

### Query Database:
```
"Show me all assignments for SOCW-6510 that are not completed"
```

### Update Entries:
```
"Update the status of 'Assignment 01' to Completed"
```

### Sync Files:
```
"Sync all files from courses/SOCW-6510 to the Notion database"
```

## Troubleshooting

### MCP Server Not Responding

1. **Check Docker is running** (if using Docker-based MCP):
   ```bash
   docker ps
   ```

2. **Verify environment variable**:
   ```bash
   echo $NOTION_API_KEY  # Linux/Mac
   echo %NOTION_API_KEY% # Windows CMD
   $env:NOTION_API_KEY   # PowerShell
   ```

3. **Restart Cursor IDE** after setting environment variables

### 401 Unauthorized Errors

- Verify integration token is correct
- Ensure workspace is shared with integration
- Check integration has required permissions

### Database Not Found

- Verify database name matches exactly
- Check integration has access to the database
- Try searching for databases first

## Next Steps

After setting up the database:

1. **Sync existing files**:
   ```bash
   cd tools/notion-integration
   node scripts/sync-files-to-notion.js
   ```

2. **Set up n8n workflows** (optional):
   - Import workflows from `workflows/notion-sync/`
   - Configure for automated syncing

3. **Start using Notion as your frontend**:
   - Add files to repository
   - Create entries in Notion
   - Keep them synchronized

## Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Notion Integration Guide](./NOTION_INTEGRATION.md)
- [MCP Server Documentation](https://cursor.com/docs/context/mcp)

