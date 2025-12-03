/**
 * Create Notion Database Directly
 * 
 * This script creates the MSW-REPO Academic Files database directly
 * using the Notion API, then saves the database ID for future reference.
 */

import { Client } from '@notionhq/client';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '../../..');

// Use the API key provided
const NOTION_API_KEY = process.env.NOTION_API_KEY;

const notion = new Client({
  auth: NOTION_API_KEY,
});

/**
 * Create the database
 */
async function createDatabase() {
  try {
    console.log('Creating MSW-REPO Academic Files database...\n');

    // First, we need a parent page. Let's search for pages we can use as parent
    console.log('Searching for workspace pages...');
    const searchResponse = await notion.search({
      filter: {
        property: 'object',
        value: 'page',
      },
    });

    if (searchResponse.results.length === 0) {
      throw new Error('No pages found in workspace. Please create a page first or share a page with the integration.');
    }

    // Use the first page as parent (or you can specify a specific page ID)
    const parentPageId = searchResponse.results[0].id;
    console.log(`Using page as parent: ${searchResponse.results[0].properties?.title || 'Untitled'}\n`);

    // Create the database
    const databaseResponse = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: parentPageId,
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'MSW-REPO Academic Files',
          },
        },
      ],
      properties: {
        'Title': {
          title: {},
        },
        'Course': {
          select: {
            options: [
              {
                name: 'SOCW-6510',
                color: 'blue',
              },
              // Add more courses as needed
            ],
          },
        },
        'Type': {
          select: {
            options: [
              { name: 'Assignment', color: 'blue' },
              { name: 'Paper', color: 'green' },
              { name: 'Article', color: 'yellow' },
              { name: 'Note', color: 'gray' },
              { name: 'Research', color: 'purple' },
              { name: 'Project', color: 'orange' },
              { name: 'Document', color: 'default' },
            ],
          },
        },
        'Category': {
          select: {
            options: [
              { name: 'Assignment', color: 'blue' },
              { name: 'Paper', color: 'green' },
              { name: 'Article', color: 'yellow' },
              { name: 'Note', color: 'gray' },
              { name: 'Research', color: 'purple' },
              { name: 'Project', color: 'orange' },
              { name: 'Document', color: 'default' },
            ],
          },
        },
        'Status': {
          select: {
            options: [
              { name: 'Draft', color: 'gray' },
              { name: 'In Progress', color: 'yellow' },
              { name: 'Completed', color: 'green' },
              { name: 'Submitted', color: 'blue' },
              { name: 'Archived', color: 'default' },
            ],
          },
        },
        'Due Date': {
          date: {},
        },
        'Tags': {
          multi_select: {
            options: [],
          },
        },
        'File Path': {
          rich_text: {},
        },
      },
    });

    const databaseId = databaseResponse.id;
    const databaseUrl = databaseResponse.url;

    console.log('✅ Database created successfully!\n');
    console.log(`📋 Database ID: ${databaseId}`);
    console.log(`🔗 Database URL: ${databaseUrl}\n`);

    // Save database ID to config file
    const configPath = join(repoRoot, '.notion-config.json');
    const config = {
      databaseId,
      databaseUrl,
      createdAt: new Date().toISOString(),
      properties: {
        title: 'Title',
        course: 'Course',
        type: 'Type',
        category: 'Category',
        status: 'Status',
        dueDate: 'Due Date',
        tags: 'Tags',
        filePath: 'File Path',
      },
    };

    writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`💾 Configuration saved to: .notion-config.json`);

    // Also update .env.example or create .env if it doesn't exist
    const envPath = join(repoRoot, '.env');
    const envContent = `# Notion Integration
NOTION_API_KEY=${NOTION_API_KEY}
NOTION_DATABASE_ID=${databaseId}
`;

    writeFileSync(envPath, envContent);
    console.log(`💾 Environment variables saved to: .env`);
    console.log('\n⚠️  IMPORTANT: Add .env to .gitignore if not already there!\n');

    return databaseId;
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    
    if (error.code === 'object_not_found') {
      console.error('\n💡 Tip: Make sure you have:');
      console.error('   1. Created a Notion integration at https://www.notion.so/my-integrations');
      console.error('   2. Shared at least one page with the integration');
      console.error('   3. Used the correct integration token');
    }
    
    throw error;
  }
}

// Run the script
createDatabase()
  .then((databaseId) => {
    console.log('\n✅ Setup complete! You can now use this database ID:', databaseId);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  });

