# Quick Start: Set Up Notion Database via MCP

Since you already have Notion MCP server configured, you can set up the database directly through Cursor chat!

## Quick Setup (5 minutes)

### 1. Verify MCP Server is Working

In Cursor chat, ask:
```
"Can you search for databases in my Notion workspace?"
```

### 2. Create the Database

Copy and paste this into Cursor chat:

```
"Using the Notion MCP server, create a new database called 'MSW-REPO Academic Files' in my Notion workspace. 

Add these properties:
- Title (title property)
- Course (select property with options: SOCW-6510)
- Type (select property with options: Assignment, Paper, Article, Note, Research, Project, Document)
- Category (select property with same options as Type)
- Status (select property with options: Draft, In Progress, Completed, Submitted, Archived)
- Due Date (date property)
- Tags (multi-select property)
- File Path (rich_text property)

Make sure the database is accessible to my integration."
```

### 3. Sync Existing Files

Once the database is created, sync your existing files:

```
"Scan the 'courses/SOCW-6510' directory in my repository. For each file found, create an entry in the 'MSW-REPO Academic Files' Notion database with:
- Title: the filename
- Course: SOCW-6510
- Type: determined from file extension (PDF=Paper, MD=Note, DOCX=Document, etc.)
- Category: determined from directory (assignments/, papers/, notes/, research/, projects/, documents/)
- File Path: relative path from repository root (e.g., courses/SOCW-6510/assignments/file.md)"
```

### 4. Verify Setup

Check that everything worked:

```
"Query the 'MSW-REPO Academic Files' database and show me all entries"
```

## That's It!

Your Notion database is now set up and synced with your repository. You can now:

- ✅ Manage files through Notion
- ✅ Add new entries in Notion and sync to repository
- ✅ Use Notion as your primary frontend

## Next Steps

- See [MCP Notion Setup Guide](docs/MCP_NOTION_SETUP.md) for detailed instructions
- See [Notion Integration Guide](docs/NOTION_INTEGRATION.md) for advanced usage
- Check [MCP Sync Helper](tools/notion-integration/scripts/mcp-sync-helper.md) for more chat prompts

## Troubleshooting

If you get authentication errors:
1. Check that `NOTION_API_KEY` environment variable is set
2. Verify your Notion integration token is correct
3. Ensure your workspace is shared with the integration
4. Restart Cursor IDE after setting environment variables

For more help, see the troubleshooting section in [MCP_NOTION_SETUP.md](docs/MCP_NOTION_SETUP.md)

