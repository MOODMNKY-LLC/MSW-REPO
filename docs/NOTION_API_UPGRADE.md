# Notion API Upgrade to 2025-09-03

## Overview

This repository has been upgraded to use Notion API version `2025-09-03`, which introduces support for multi-source databases. This upgrade ensures compatibility with Notion's latest features and may resolve MCP authentication issues.

**Upgrade Guide Reference**: [Notion API Upgrade Guide 2025-09-03](https://developers.notion.com/docs/upgrade-guide-2025-09-03)

## What Changed

### API Version
- **Previous**: Default (2022-06-28)
- **Current**: `2025-09-03`

### SDK Version
- **Previous**: `@notionhq/client` v2.3.0
- **Current**: `@notionhq/client` v5.4.0

### Key Changes

1. **Data Sources**: Databases now use `data_source_id` instead of `database_id` for many operations
2. **Page Creation**: Pages created in databases now use `data_source_id` parent
3. **Database Queries**: Queries now use `dataSources.query()` instead of `databases.query()`
4. **Relation Properties**: Relation properties now include both `database_id` and `data_source_id`

## Migration Status

✅ **Migration Complete**

All databases have been migrated and verified:

- ✅ MSW-REPO Academic Files
- ✅ Assignments
- ✅ Treatment Plans
- ✅ Session Notes
- ✅ Annotated Bibliographies
- ✅ Articles
- ✅ Rubrics & Guides
- ✅ Textbooks & Resources

## Configuration

Data source IDs are stored in `.notion-config.json`:

```json
{
  "dataSources": {
    "database-id": {
      "id": "data-source-id",
      "name": "Data Source Name",
      "databaseId": "database-id"
    }
  }
}
```

## Updated Scripts

### Helper Functions (`notion-api-helper.js`)

New helper functions for working with the 2025-09-03 API:

- `createNotionClient()` - Creates client with 2025-09-03 version
- `getDataSourceId(databaseId)` - Fetches data source ID from database
- `getDataSources(databaseId)` - Gets all data sources for a database
- `createPageInDataSource(dataSourceId, properties)` - Creates page with data source parent
- `queryDataSource(dataSourceId, options)` - Queries a data source
- `migrateDatabaseToDataSource(databaseId, config)` - Migration helper

### Updated Scripts

- ✅ `sync-files-to-notion.js` - Updated to use data source IDs
- ✅ `migrate-to-2025-09-03.js` - Migration script
- ✅ `notion-api-helper.js` - New helper functions

## Usage Examples

### Creating a Page in a Data Source

```javascript
import { createNotionClient, getDataSourceId, createPageInDataSource } from './notion-api-helper.js';

const notion = createNotionClient();
const databaseId = 'your-database-id';

// Get data source ID
const dataSourceId = await getDataSourceId(databaseId);

// Create page
await createPageInDataSource(dataSourceId, {
  'Title': {
    title: [{ text: { content: 'New Page' } }],
  },
});
```

### Querying a Data Source

```javascript
import { queryDataSource } from './notion-api-helper.js';

const dataSourceId = 'your-data-source-id';

const results = await queryDataSource(dataSourceId, {
  filter: {
    property: 'Status',
    select: {
      equals: 'In Progress',
    },
  },
});
```

### Getting Data Source from Database

```javascript
import { getDataSources } from './notion-api-helper.js';

const databaseId = 'your-database-id';
const dataSources = await getDataSources(databaseId);

// Use first data source (default)
const dataSource = dataSources[0];
console.log(`Data Source ID: ${dataSource.id}`);
console.log(`Data Source Name: ${dataSource.name}`);
```

## MCP Server Configuration

If you're using Notion MCP server, ensure it's configured with:

1. **API Version**: Set to `2025-09-03` in MCP configuration
2. **Authentication**: Ensure API key is properly configured
3. **Data Source IDs**: MCP server should use data source IDs for database operations

### MCP Configuration Example

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
        "NOTION_API_KEY": "your-api-key",
        "NOTION_API_VERSION": "2025-09-03"
      }
    }
  }
}
```

## Troubleshooting

### MCP Authentication Issues

If you're experiencing MCP authentication issues:

1. **Verify API Key**: Ensure `NOTION_API_KEY` is set correctly
2. **Check API Version**: Ensure MCP server uses `2025-09-03`
3. **Run Migration**: Run `pnpm run migrate` to ensure data sources are discovered
4. **Verify Access**: Ensure integration has access to all databases

### Database Not Found Errors

If you see "object_not_found" errors:

1. **Check Database Sharing**: Ensure databases are shared with your integration
2. **Verify IDs**: Check `.notion-config.json` for correct database IDs
3. **Re-run Migration**: Run `pnpm run migrate` to refresh data source IDs

### Relation Property Errors

If relation properties fail:

1. **Use Data Source ID**: Ensure relation properties use `data_source_id` instead of `database_id`
2. **Check Both IDs**: Relation responses include both `database_id` and `data_source_id`
3. **Update Scripts**: Ensure all scripts use the helper functions

## Running Migration

To migrate or re-migrate databases:

```bash
cd tools/notion-integration
pnpm run migrate
```

This will:
1. Discover all databases in config
2. Fetch data source IDs for each database
3. Save data source IDs to `.notion-config.json`
4. Verify all data sources are accessible

## Testing

After migration, test your integration:

```bash
# Test sync script
cd tools/notion-integration
pnpm run sync

# Test MCP server (if configured)
# Use Cursor chat to query databases
```

## Backward Compatibility

The upgrade maintains backward compatibility where possible:

- **Database IDs**: Still stored and used for reference
- **Relation Properties**: Include both `database_id` and `data_source_id`
- **API Calls**: Can use either ID format (but data source ID is preferred)

## Resources

- [Notion API Upgrade Guide](https://developers.notion.com/docs/upgrade-guide-2025-09-03)
- [Notion API FAQs 2025-09-03](https://developers.notion.com/docs/upgrade-faqs-2025-09-03)
- [Notion SDK v5 Release Notes](https://github.com/makenotion/notion-sdk-js/releases/tag/v5.0.0)
- [Working with Databases](https://developers.notion.com/docs/working-with-databases)

## Next Steps

1. ✅ Upgrade SDK to v5
2. ✅ Migrate all databases
3. ✅ Update sync scripts
4. ⏳ Update remaining scripts (create-page, update-metadata, etc.)
5. ⏳ Test MCP server integration
6. ⏳ Update webhook handlers (if applicable)

## Support

If you encounter issues:

1. Check `.notion-config.json` for correct data source IDs
2. Verify API key is correct
3. Ensure databases are shared with integration
4. Run migration script again
5. Check Notion API status

---

**Last Updated**: December 3, 2025
**API Version**: 2025-09-03
**SDK Version**: 5.4.0

