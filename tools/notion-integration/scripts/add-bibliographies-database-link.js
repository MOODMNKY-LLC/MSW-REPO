/**
 * Add Annotated Bibliographies Database Link to HUB Page
 * 
 * This script adds a link to the Annotated Bibliographies database on the HUB page
 * in the correct location (after Session Notes).
 */

import { Client } from '@notionhq/client';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '../../..');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_API_VERSION = '2025-09-03';

const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: NOTION_API_VERSION,
});

/**
 * Get config values
 */
function getConfig() {
  try {
    const configPath = join(repoRoot, '.notion-config.json');
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error('Could not read .notion-config.json:', error.message);
    throw error;
  }
}

/**
 * Add database link to HUB page
 */
async function addBibliographiesLink(pageId) {
  try {
    console.log('🔍 Analyzing HUB page structure...\n');

    // Get all blocks from the page
    let allBlocks = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: startCursor,
        page_size: 100,
      });

      allBlocks = allBlocks.concat(response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    console.log(`📋 Found ${allBlocks.length} total blocks\n`);

    const config = getConfig();
    const databaseId = config.academicDatabases.bibliographies;

    // Check if link already exists
    let linkExists = false;
    let sessionNotesBlockId = null;

    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      
      if (block.type === 'child_database') {
        const childDb = block.child_database || {};
        const title = childDb.title || '';
        const dbId = childDb.database_id;
        
        if (title === 'Session Notes') {
          sessionNotesBlockId = block.id;
          console.log(`✅ Found Session Notes database at index ${i}`);
        }
        
        if (title === 'Annotated Bibliographies' && dbId === databaseId) {
          console.log(`✅ Annotated Bibliographies database link already exists!\n`);
          linkExists = true;
          break;
        }
      }
      
      // Also check for link_to_page blocks
      if (block.type === 'link_to_page') {
        const linkPageId = block.link_to_page?.page_id || block.link_to_page?.database_id;
        if (linkPageId === databaseId) {
          console.log(`✅ Annotated Bibliographies link already exists (as link_to_page)!\n`);
          linkExists = true;
          break;
        }
      }
    }

    if (linkExists) {
      console.log('✅ Database link already exists on HUB page!');
      return;
    }

    // Find insertion point (after Session Notes database)
    let insertAfterBlockId = null;
    
    if (sessionNotesBlockId) {
      insertAfterBlockId = sessionNotesBlockId;
      console.log(`📝 Will insert after Session Notes database\n`);
    } else {
      // Find the last database block before the divider
      for (let i = allBlocks.length - 1; i >= 0; i--) {
        const block = allBlocks[i];
        if (block.type === 'child_database') {
          insertAfterBlockId = block.id;
          console.log(`📝 Will insert after last database block\n`);
          break;
        }
      }
    }

    if (!insertAfterBlockId) {
      throw new Error('Could not find insertion point for database link');
    }

    console.log('📚 Adding Annotated Bibliographies database link...\n');

    // Try creating a link_to_page block pointing to the database
    // Databases in Notion are also pages, so we can link to them
    const linkBlock = {
      object: 'block',
      type: 'link_to_page',
      link_to_page: {
        type: 'database_id',
        database_id: databaseId,
      },
    };

    try {
      await notion.blocks.children.append({
        block_id: pageId,
        after: insertAfterBlockId,
        children: [linkBlock],
      });
      console.log('✅ Successfully added database link!\n');
    } catch (error) {
      if (error.message.includes('link_to_page') || error.message.includes('database_id')) {
        // If link_to_page doesn't work, try creating a paragraph with a database mention
        console.log('⚠️  link_to_page not supported, trying paragraph with database mention...\n');
        
        const paragraphBlock = {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'mention',
                mention: {
                  type: 'database',
                  database: {
                    id: databaseId,
                  },
                },
                annotations: {
                  bold: true,
                },
              },
            ],
          },
        };

        await notion.blocks.children.append({
          block_id: pageId,
          after: insertAfterBlockId,
          children: [paragraphBlock],
        });
        console.log('✅ Successfully added database mention!\n');
      } else {
        throw error;
      }
    }

    console.log(`🔗 View your HUB page: https://www.notion.so/${pageId.replace(/-/g, '')}`);
    console.log(`📚 Database URL: https://www.notion.so/${databaseId.replace(/-/g, '')}\n`);

  } catch (error) {
    console.error('❌ Error adding database link:', error.message);
    throw error;
  }
}

/**
 * Verify bibliographies exist
 */
async function verifyBibliographies() {
  try {
    const config = getConfig();
    const databaseId = config.academicDatabases.bibliographies;

    console.log('🔍 Verifying bibliographies in database...\n');

    // Query the database - try both methods for compatibility
    let response;
    try {
      response = await notion.databases.query({
        database_id: databaseId,
        notionVersion: NOTION_API_VERSION,
      });
    } catch (error) {
      // If that fails, try without notionVersion
      response = await notion.databases.query({
        database_id: databaseId,
      });
    }

    console.log(`📚 Found ${response.results.length} bibliography entries:\n`);

    if (response.results.length === 0) {
      console.log('⚠️  No bibliographies found! They may need to be recreated.\n');
      return false;
    }

    for (const page of response.results) {
      const topic = page.properties?.Topic?.title?.[0]?.plain_text || 'Untitled';
      const course = page.properties?.Course?.select?.name || 'N/A';
      const status = page.properties?.Status?.select?.name || 'N/A';
      console.log(`   ✅ ${topic}`);
      console.log(`      Course: ${course}, Status: ${status}`);
      console.log(`      URL: https://www.notion.so/${page.id.replace(/-/g, '')}\n`);
    }

    return true;
  } catch (error) {
    console.error('❌ Error verifying bibliographies:', error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config = getConfig();
    const hubPageId = config.hubPageId;
    
    if (!hubPageId) {
      throw new Error('hubPageId not found in config');
    }

    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     Add Annotated Bibliographies Database Link              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    // First verify bibliographies exist
    const bibliographiesExist = await verifyBibliographies();

    if (!bibliographiesExist) {
      console.log('⚠️  Bibliographies not found. Creating them now...\n');
      // Import and run the create bibliographies function
      const createBibModule = await import('./create-attachment-bibliographies.js');
      // The function might be exported differently, let's call it directly
      if (typeof createBibModule.createBibliographies === 'function') {
        await createBibModule.createBibliographies();
      } else if (typeof createBibModule.default === 'function') {
        await createBibModule.default();
      } else {
        // Run the script directly
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        await execAsync('node tools/notion-integration/scripts/create-attachment-bibliographies.js');
      }
    }

    // Add database link to HUB page
    console.log('\n📄 Adding database link to HUB page...\n');
    await addBibliographiesLink(hubPageId);

    console.log('✅ Complete! Your Annotated Bibliographies database is now linked on the HUB page.\n');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();

