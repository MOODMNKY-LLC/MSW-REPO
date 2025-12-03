# Notion Integration Guide

## Overview

MSW-REPO is designed to work seamlessly with Notion as your primary programmatic frontend. Notion serves as the interface for managing and organizing your academic work, while this repository stores the actual files, documents, papers, articles, and assignments.

> **⚠️ Important**: This guide covers **direct API integration** using scripts. The **primary method** for Notion integration is the **Official Notion MCP** (OAuth-based) via Cursor IDE. See [Official Notion MCP Setup](./NOTION_MCP_OFFICIAL_SETUP.md) for the recommended approach.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│     Notion      │ ◄─────► │  MSW-REPO        │ ◄─────► │   GitHub     │
│   (Frontend)    │  Sync   │  (File Storage)  │  VC     │  (Backup)    │
└─────────────────┘         └──────────────────┘         └──────────────┘
```

### Notion's Role
- **Primary Interface**: Manage all academic content through Notion databases
- **Metadata Management**: Store properties, tags, status, due dates
- **Organization**: Filter, sort, and view content in multiple ways
- **Collaboration**: Share and collaborate on academic work

### Repository's Role
- **File Storage**: Store actual files (PDFs, documents, notes, etc.)
- **Version Control**: Track changes and maintain history
- **Automation**: Run scripts and workflows
- **Development**: Host web applications and tools

## Setting Up Notion Integration

> **⭐ Primary Method**: Use the **Official Notion MCP** (OAuth) via Cursor IDE. See [Official Notion MCP Setup](./NOTION_MCP_OFFICIAL_SETUP.md) for setup instructions. This is the recommended approach and is already configured.

> **Alternative Method**: The following steps describe direct API integration using scripts. This is useful for automation but Notion MCP is the primary interface.

### Step 1: Create Notion Database

1. Create a new database in Notion
2. Add the following properties:
   - **Title** (Title) - File name
   - **Course** (Select) - Course codes
   - **Type** (Select) - Assignment, Paper, Article, Note, etc.
   - **Status** (Select) - Draft, In Progress, Completed, Submitted
   - **Due Date** (Date) - For assignments
   - **Tags** (Multi-select) - For categorization
   - **File Path** (Text) - Path to file in repository
   - **Created** (Created time) - Auto
   - **Updated** (Last edited time) - Auto

3. Create views:
   - **All Files** - Table view sorted by updated date
   - **By Course** - Grouped by course
   - **By Type** - Board view grouped by type
   - **Assignments** - Filtered view for assignments

### Step 2: Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Choose "Internal" integration type
4. Name it "MSW-REPO Integration"
5. Copy the integration token
6. Share your database with the integration

### Step 3: Configure Environment Variables

Add to your `.env` file:
```bash
NOTION_API_KEY=your_integration_token
NOTION_DATABASE_ID=your_database_id
```

### Step 4: Install Integration Tools

```bash
cd tools/notion-integration
pnpm install
```

## Usage Patterns

### Pattern 1: File → Notion Sync

When you add a new file to the repository, sync it to Notion:

```bash
cd tools/notion-integration
node scripts/sync-files-to-notion.js [course-code]
```

This will:
- Scan the repository for files
- Create Notion database entries
- Link files to their Notion pages

### Pattern 2: Notion → File Organization

When you create a new entry in Notion, organize files accordingly:

1. Create entry in Notion database
2. Add file to repository in appropriate location
3. Update File Path property in Notion
4. Run sync script to verify

### Pattern 3: Bidirectional Workflow

Use n8n workflows (in `workflows/notion-sync/`) for automated bidirectional sync:

- **File Watcher** → Detect new files → Create Notion entry
- **Notion Webhook** → Detect database changes → Organize files
- **Scheduled Sync** → Periodic synchronization

## File Organization Structure

Files are organized in the repository following this structure:

```
courses/
└── SOCW-6510/
    ├── assignments/    # Homework assignments
    ├── papers/         # Research papers
    ├── articles/       # Academic articles
    ├── notes/          # Class notes
    ├── research/       # Research materials
    ├── projects/       # Course projects
    └── documents/      # Other documents
```

Notion database properties map to this structure:
- **Course** property → `courses/{course-code}/`
- **Type** property → Subdirectory (assignments/, papers/, etc.)
- **File Path** property → Full relative path

## Workflow Examples

### Example 1: Adding a New Assignment

1. **In Notion**:
   - Create new database entry
   - Set Course: SOCW-6510
   - Set Type: Assignment
   - Set Due Date: [date]
   - Set Status: In Progress

2. **In Repository**:
   - Create file: `courses/SOCW-6510/assignments/assignment-01.md`
   - Write assignment content

3. **Sync**:
   - Update Notion File Path property: `courses/SOCW-6510/assignments/assignment-01.md`
   - Or run sync script to auto-detect

### Example 2: Organizing Research Papers

1. **Add Paper to Repository**:
   - Place PDF in `courses/SOCW-6510/papers/`

2. **Sync to Notion**:
   ```bash
   node scripts/sync-files-to-notion.js SOCW-6510
   ```

3. **Enhance in Notion**:
   - Add tags, notes, annotations
   - Link to related assignments or projects
   - Add reading status

## Automation with n8n

n8n workflows enable advanced automation:

### Workflow: Auto-Sync New Files

1. **Trigger**: File added to repository
2. **Action**: Create Notion database entry
3. **Action**: Extract metadata from filename
4. **Action**: Set properties based on file location

### Workflow: Notion → File Organization

1. **Trigger**: New Notion database entry created
2. **Action**: Create file structure if needed
3. **Action**: Generate file template
4. **Action**: Link Notion page to file

### Workflow: Scheduled Backup

1. **Trigger**: Daily at 2 AM
2. **Action**: Sync all files to Notion
3. **Action**: Verify file paths
4. **Action**: Report sync status

## Best Practices

### File Naming

Use consistent naming conventions:
- Assignments: `assignment-01-title.md`
- Papers: `YYYY-MM-DD-paper-title.pdf`
- Notes: `YYYY-MM-DD-lecture-topic.md`

### Notion Properties

- Always set **Course** property for course-related files
- Use **Tags** for cross-course categorization
- Keep **File Path** updated when moving files
- Use **Status** to track progress

### Sync Frequency

- **Manual Sync**: Run sync script after major file additions
- **Automated Sync**: Use n8n workflows for continuous sync
- **Scheduled Sync**: Daily sync for verification

### Version Control

- Commit files to Git regularly
- Use Notion's version history for content changes
- Link Git commits to Notion pages when relevant

## Troubleshooting

### Files Not Syncing

1. Check Notion API key is correct
2. Verify database is shared with integration
3. Check file paths are relative to repository root
4. Review script output for errors

### Notion Properties Not Updating

1. Verify property names match schema
2. Check property types are correct
3. Ensure integration has write permissions

### Sync Conflicts

1. Resolve conflicts manually in Notion
2. Update File Path property if file moved
3. Re-run sync script to verify

## Advanced Features

### Custom Properties

Add custom properties to Notion database:
- **Priority** (Select) - High, Medium, Low
- **Related Projects** (Relation) - Link to projects database
- **Review Date** (Date) - When to review content
- **Notes** (Text) - Additional notes

### Integration with Other Tools

- **Zotero**: Sync citations to Notion
- **Google Calendar**: Link assignments to calendar
- **GitHub**: Link code repositories to Notion pages

## Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Notion Integration Tools](../tools/notion-integration/)
- [n8n Workflows](../workflows/notion-sync/)
- [Notion Database Schema](../tools/notion-integration/config/notion-schema.json)

