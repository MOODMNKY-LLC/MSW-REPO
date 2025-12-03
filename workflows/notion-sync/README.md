# Notion Sync Workflows

This directory contains n8n workflow definitions for synchronizing content between Notion and MSW-REPO.

## Available Workflows

### `file-to-notion-sync.json`
Automatically creates Notion database entries when new files are added to the repository.

**Trigger**: File watcher (monitors repository for new files)
**Actions**:
1. Detect new file
2. Extract metadata (course, type, category)
3. Create Notion database entry
4. Set properties based on file location

### `notion-to-file-org.json`
Organizes repository files based on Notion database changes.

**Trigger**: Notion webhook (database entry created/updated)
**Actions**:
1. Detect Notion database change
2. Create file structure if needed
3. Generate file template
4. Link Notion page to file

### `scheduled-sync.json`
Periodic synchronization to keep Notion and repository in sync.

**Trigger**: Cron (daily at 2 AM)
**Actions**:
1. Scan repository for files
2. Compare with Notion database
3. Create missing entries
4. Update changed entries
5. Report sync status

## Setup

1. **Import Workflow**:
   - Open n8n
   - Import workflow JSON file
   - Configure credentials (Notion API, file system)

2. **Configure Triggers**:
   - Set up file watcher paths
   - Configure Notion webhook URL
   - Set cron schedule

3. **Set Environment Variables**:
   ```bash
   NOTION_API_KEY=your_token
   NOTION_DATABASE_ID=your_database_id
   REPO_PATH=/path/to/MSW-REPO
   ```

4. **Activate Workflow**:
   - Test workflow manually
   - Activate for production use

## Customization

Workflows can be customized for:
- Different file types
- Custom metadata extraction
- Additional Notion properties
- Integration with other tools

## Best Practices

- Test workflows in development mode first
- Monitor workflow execution logs
- Set up error notifications
- Regular backup of workflow definitions
- Version control workflow JSON files

