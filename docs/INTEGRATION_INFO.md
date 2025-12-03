# Notion Integration Information

## SCHOLAR MNKY Integration

### Integration Details

- **Name**: SCHOLAR MNKY
- **Type**: Internal Integration
- **Teamspace**: MSW H.Q. Teamspace
- **API Key**: Stored in `.env` file (gitignored)
- **Status**: ✅ Active and Configured

### Database

- **Database Name**: MSW-REPO Academic Files
- **Database ID**: `2becd2a6-5422-816e-93b6-e3db7b4af11b`
- **Database URL**: https://www.notion.so/2becd2a65422816e93b6e3db7b4af11b
- **Location**: MSW H.Q. Teamspace

### Configuration Files

- **Environment Variables**: `.env` (gitignored, contains API key)
- **Database Config**: `.notion-config.json` (version controlled)
- **MCP Config**: `.cursor/mcp.json` (uses environment variable)

### Access

The SCHOLAR MNKY integration has access to:
- ✅ MSW H.Q. Teamspace
- ✅ MSW-REPO Academic Files database
- ✅ Read, create, and update database entries

### Security

- API key is stored in `.env` which is gitignored
- Never commit the `.env` file to version control
- Database ID is safe to commit (it's just an identifier)
- Integration token should be kept secure

### Usage

The integration is used for:
1. Syncing repository files to Notion database
2. Creating database entries via scripts
3. Querying database via MCP server
4. Automated workflow synchronization

### Troubleshooting

If you encounter access issues:

1. **Verify Integration Access**:
   - Go to https://www.notion.so/my-integrations
   - Find "SCHOLAR MNKY" integration
   - Verify it has access to MSW H.Q. Teamspace

2. **Check Database Sharing**:
   - Open the database in Notion
   - Click "Share" → "Add people, emails, groups, or integrations"
   - Ensure "SCHOLAR MNKY" is listed

3. **Verify API Key**:
   - Check `.env` file has correct `NOTION_API_KEY`
   - Ensure no extra spaces or quotes
   - Restart Cursor IDE after updating

### Updating Integration

If you need to update the integration:

1. Update `.env` file with new API key
2. Update `.notion-config.json` if database changes
3. Restart Cursor IDE to reload environment variables
4. Test connection with verification script

