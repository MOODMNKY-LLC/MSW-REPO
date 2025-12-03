# Notion Integration Tools

This directory contains tools and scripts for integrating MSW-REPO with Notion as the primary programmatic frontend.

## Overview

Notion serves as the primary interface for managing your academic work, while this repository stores the actual files and documents. The integration tools enable:

- **Bidirectional Sync**: Keep Notion databases and repository files in sync
- **Automated Organization**: Automatically organize files based on Notion database entries
- **Metadata Management**: Link file metadata with Notion database properties
- **Workflow Automation**: Automate repetitive tasks between Notion and file storage

## Structure

```
tools/notion-integration/
├── scripts/          # Node.js/Python scripts for Notion API operations
├── config/           # Configuration files and schemas
└── examples/         # Example scripts and usage patterns
```

## Prerequisites

- Notion API integration token
- Node.js 18+ (for Node.js scripts)
- Python 3.8+ (for Python scripts, if used)
- Access to Notion workspace with appropriate permissions

## Setup

1. **Create Notion Integration**:
   - Go to https://www.notion.so/my-integrations
   - Create a new internal integration
   - Copy the integration token
   - Grant access to your workspace

2. **Set Environment Variables**:
   ```bash
   export NOTION_API_KEY=your_integration_token
   export NOTION_DATABASE_ID=your_database_id
   ```

3. **Install Dependencies**:
   ```bash
   cd tools/notion-integration
   pnpm install
   ```

## Usage

See individual script documentation for specific use cases:
- `scripts/sync-files-to-notion.js` - Sync repository files to Notion database
- `scripts/create-notion-page.js` - Create Notion pages from file metadata
- `scripts/update-file-metadata.js` - Update file metadata from Notion

## Notion Database Schema

Recommended database structure for academic content:

### Properties
- **Title** (Title) - File/document name
- **Course** (Select) - Course code (e.g., SOCW-6510)
- **Type** (Select) - Document type (Assignment, Paper, Article, Note, etc.)
- **Status** (Select) - Status (Draft, In Progress, Completed, Submitted)
- **Due Date** (Date) - Due date for assignments
- **Tags** (Multi-select) - Tags for categorization
- **File Path** (Text) - Path to file in repository
- **Created** (Created time) - Auto-generated
- **Updated** (Last edited time) - Auto-generated

## Integration Patterns

### Pattern 1: File → Notion Sync
When a new file is added to the repository, automatically create a Notion database entry.

### Pattern 2: Notion → File Organization
When a Notion database entry is created/updated, organize files accordingly in the repository.

### Pattern 3: Bidirectional Sync
Keep Notion database and repository files synchronized in both directions.

## Workflow Automation

Use n8n workflows (stored in `workflows/notion-sync/`) for:
- Automated file syncing
- Scheduled backups
- Metadata updates
- Cross-platform synchronization

## Security

- Never commit Notion API tokens to the repository
- Use environment variables for sensitive configuration
- Review file paths before syncing to prevent exposing sensitive data

