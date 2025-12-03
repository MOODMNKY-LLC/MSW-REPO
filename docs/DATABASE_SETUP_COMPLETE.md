# ✅ Notion Database Setup Complete!

## Database Created Successfully

Your **MSW-REPO Academic Files** database has been created in Notion!

### Integration Details

- **Integration Name**: SCHOLAR MNKY
- **Teamspace**: MSW H.Q. Teamspace
- **Status**: ✅ Configured and Accessible

### Database Information

- **Database ID**: `2becd2a6-5422-816e-93b6-e3db7b4af11b`
- **Database URL**: https://www.notion.so/2becd2a65422816e93b6e3db7b4af11b
- **Configuration File**: `.notion-config.json` (in repository root)

### Database Properties

The database includes the following properties:

1. **Title** (Title) - File/document name
2. **Course** (Select) - Course codes (SOCW-6510, etc.)
3. **Type** (Select) - Assignment, Paper, Article, Note, Research, Project, Document
4. **Category** (Select) - Same options as Type
5. **Status** (Select) - Draft, In Progress, Completed, Submitted, Archived
6. **Due Date** (Date) - For assignments
7. **Tags** (Multi-select) - For categorization
8. **File Path** (Rich Text) - Path to file in repository

## Next Steps

### 1. Verify Database in Notion

Open the database URL above to see your new database in Notion. You should see all the properties configured.

### 2. Sync Existing Files

Now you can sync your existing files to the database:

```bash
cd tools/notion-integration
# API key is loaded from .env file
node scripts/sync-files-to-notion.js SOCW-6510
```

Or use Cursor chat with MCP:
```
"Scan the 'courses/SOCW-6510' directory and sync all files to the 'MSW-REPO Academic Files' database (ID: 2becd2a6-5422-816e-93b6-e3db7b4af11b)"
```

### 3. Update MCP Configuration

To use the MCP server going forward, ensure your `.cursor/mcp.json` has the Notion server configured with the API key. The database ID is now stored in `.notion-config.json` for reference.

### 4. Set Up Environment Variables

Create a `.env` file in the repository root (it's gitignored):

```bash
NOTION_API_KEY=YOUR_NOTION_API_KEY_HERE
NOTION_DATABASE_ID=2becd2a6-5422-816e-93b6-e3db7b4af11b
```

**Note**: The `.env` file is already created with the SCHOLAR MNKY integration credentials.

## Using the Database

### Via Cursor Chat (MCP)

You can now use Cursor chat to interact with your database:

```
"Create a new entry in the MSW-REPO Academic Files database:
Title: Assignment 01
Course: SOCW-6510
Type: Assignment
Status: In Progress
File Path: courses/SOCW-6510/assignments/assignment-01.md"
```

```
"Query the MSW-REPO Academic Files database for all entries where Course is SOCW-6510"
```

### Via Scripts

Use the sync script to keep files and database in sync:

```bash
cd tools/notion-integration
pnpm run sync [course-code]
```

## Database Views

You can create custom views in Notion:

1. **All Files** - Table view sorted by updated date
2. **By Course** - Grouped by course
3. **By Type** - Board view grouped by type
4. **Assignments** - Filtered view for assignments only

## Security Note

⚠️ **Important**: Your Notion API key is stored in `.env` which is gitignored. Never commit API keys to the repository. The `.env.example` file shows the structure without actual keys.

## Troubleshooting

If you encounter issues:

1. **Database not found**: Verify the database ID in `.notion-config.json`
2. **Permission errors**: Ensure your Notion integration has access to the database
3. **Sync issues**: Check that file paths are relative to repository root

## Resources

- Database Configuration: `.notion-config.json`
- Sync Script: `tools/notion-integration/scripts/sync-files-to-notion.js`
- Integration Guide: `docs/NOTION_INTEGRATION.md`
- MCP Setup: `docs/MCP_NOTION_SETUP.md`

---

**Database Setup Date**: December 3, 2025
**Status**: ✅ Complete and Ready to Use

