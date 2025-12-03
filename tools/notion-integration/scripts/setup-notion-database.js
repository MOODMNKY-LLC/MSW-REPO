/**
 * Setup Notion Database for MSW-REPO
 * 
 * This script uses the Notion MCP server (via Cursor) to create
 * the Academic Files Database with all required properties.
 * 
 * Note: This script is designed to be run in Cursor IDE where
 * the Notion MCP server is available.
 * 
 * Usage:
 *   Run this script and follow the prompts, or use the MCP
 *   server directly via Cursor's chat interface.
 */

/**
 * Database Schema Configuration
 * 
 * Use this configuration when creating the database via Notion MCP:
 */

export const DATABASE_SCHEMA = {
  title: "MSW-REPO Academic Files",
  description: "Database for organizing academic files, documents, papers, and assignments from MSW-REPO",
  properties: {
    "Title": {
      type: "title"
    },
    "Course": {
      type: "select",
      select: {
        options: [
          { name: "SOCW-6510", color: "blue" },
          // Add more courses as needed
        ]
      }
    },
    "Type": {
      type: "select",
      select: {
        options: [
          { name: "Assignment", color: "blue" },
          { name: "Paper", color: "green" },
          { name: "Article", color: "yellow" },
          { name: "Note", color: "gray" },
          { name: "Research", color: "purple" },
          { name: "Project", color: "orange" },
          { name: "Document", color: "default" }
        ]
      }
    },
    "Category": {
      type: "select",
      select: {
        options: [
          { name: "Assignment", color: "blue" },
          { name: "Paper", color: "green" },
          { name: "Article", color: "yellow" },
          { name: "Note", color: "gray" },
          { name: "Research", color: "purple" },
          { name: "Project", color: "orange" },
          { name: "Document", color: "default" }
        ]
      }
    },
    "Status": {
      type: "select",
      select: {
        options: [
          { name: "Draft", color: "gray" },
          { name: "In Progress", color: "yellow" },
          { name: "Completed", color: "green" },
          { name: "Submitted", color: "blue" },
          { name: "Archived", color: "default" }
        ]
      }
    },
    "Due Date": {
      type: "date"
    },
    "Tags": {
      type: "multi_select",
      multi_select: {
        options: [] // Can be populated dynamically
      }
    },
    "File Path": {
      type: "rich_text"
    }
  }
};

/**
 * Instructions for Manual Setup via Notion MCP
 * 
 * Since the MCP server needs proper authentication, here are the steps:
 * 
 * 1. Ensure Notion MCP is configured in .cursor/mcp.json
 * 2. Set NOTION_API_KEY environment variable
 * 3. Create integration at https://www.notion.so/my-integrations
 * 4. Share your workspace/page with the integration
 * 
 * Then use Cursor's chat to:
 * - Search for existing databases
 * - Create new database with the schema above
 * - Or update existing database properties
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║     MSW-REPO Notion Database Setup                           ║
╚══════════════════════════════════════════════════════════════╝

To set up the Notion database using the MCP server:

1. Ensure Notion MCP is configured:
   - Check .cursor/mcp.json has Notion server configured
   - Set NOTION_API_KEY environment variable

2. Create Notion Integration:
   - Go to: https://www.notion.so/my-integrations
   - Create new internal integration
   - Copy the integration token
   - Share your workspace with the integration

3. Use Cursor Chat with MCP:
   Ask Cursor to:
   - "Search for databases in my Notion workspace"
   - "Create a new database called 'MSW-REPO Academic Files'"
   - "Add properties: Course (select), Type (select), Status (select), etc."

4. Or use the schema configuration above to create via API

Schema Configuration:
${JSON.stringify(DATABASE_SCHEMA, null, 2)}
`);

