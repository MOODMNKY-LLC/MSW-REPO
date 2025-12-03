/**
 * Fix Annotated Bibliographies Database Link on HUB Page
 * 
 * This script ensures the HUB page has the correct link to the Annotated Bibliographies
 * database that contains the attachment theory bibliographies we created.
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
 * Find and fix the Annotated Bibliographies database link
 */
async function fixBibliographiesLink(pageId) {
  try {
    console.log('🔍 Analyzing HUB page blocks...\n');

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
    const correctDatabaseId = config.academicDatabases.bibliographies;
    const correctDataSourceId = config.dataSources[correctDatabaseId]?.id;

    if (!correctDatabaseId || !correctDataSourceId) {
      throw new Error('Could not find Annotated Bibliographies database ID in config');
    }

    console.log(`✅ Correct database ID: ${correctDatabaseId}`);
    console.log(`✅ Correct data source ID: ${correctDataSourceId}\n`);

    // Find the Annotated Bibliographies database block
    let bibliographiesBlockIndex = -1;
    let bibliographiesBlock = null;
    let foundCorrectLink = false;

    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      
      if (block.type === 'child_database') {
        const childDb = block.child_database || {};
        const title = childDb.title || '';
        const databaseId = childDb.database_id;
        const dataSourceId = childDb.data_source_id;

        if (title === 'Annotated Bibliographies') {
          bibliographiesBlockIndex = i;
          bibliographiesBlock = block;
          
          console.log(`📚 Found Annotated Bibliographies block at index ${i}`);
          console.log(`   Current database ID: ${databaseId || 'N/A'}`);
          console.log(`   Current data source ID: ${dataSourceId || 'N/A'}`);

          // Check if it's the correct one
          if (databaseId === correctDatabaseId || dataSourceId === correctDataSourceId) {
            console.log(`   ✅ This is the correct database link!\n`);
            foundCorrectLink = true;
            break;
          } else {
            console.log(`   ❌ This is the wrong database link - needs to be replaced\n`);
          }
        }
      }
    }

    if (foundCorrectLink) {
      console.log('✅ HUB page already has the correct Annotated Bibliographies database link!');
      return;
    }

    // If we found a wrong link, delete it
    if (bibliographiesBlock) {
      console.log('🗑️  Deleting incorrect Annotated Bibliographies database link...');
      try {
        await notion.blocks.delete({
          block_id: bibliographiesBlock.id,
        });
        console.log('   ✅ Deleted incorrect link\n');
      } catch (error) {
        console.error('   ⚠️  Could not delete block:', error.message);
      }
    }

    // Find where to insert the new database link (after Session Notes, before Articles)
    let insertAfterIndex = -1;
    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      if (block.type === 'child_database') {
        const childDb = block.child_database || {};
        const title = childDb.title || '';
        if (title === 'Session Notes') {
          insertAfterIndex = i;
          break;
        }
      }
    }

    if (insertAfterIndex === -1) {
      // If Session Notes not found, insert after the last database block before the divider
      for (let i = allBlocks.length - 1; i >= 0; i--) {
        const block = allBlocks[i];
        if (block.type === 'child_database') {
          insertAfterIndex = i;
          break;
        }
      }
    }

    console.log(`📝 Inserting correct Annotated Bibliographies database link after index ${insertAfterIndex}...`);

    // Create the new database block
    const newDatabaseBlock = {
      object: 'block',
      type: 'child_database',
      child_database: {
        database_id: correctDatabaseId,
        data_source_id: correctDataSourceId,
        title: 'Annotated Bibliographies',
      },
    };

    // Insert the block
    if (insertAfterIndex >= 0) {
      // Insert after the specified block
      const afterBlockId = allBlocks[insertAfterIndex].id;
      await notion.blocks.children.append({
        block_id: pageId,
        after: afterBlockId,
        children: [newDatabaseBlock],
      });
    } else {
      // Append to end (before the divider before Academic Management section)
      await notion.blocks.children.append({
        block_id: pageId,
        children: [newDatabaseBlock],
      });
    }

    console.log('✅ Successfully added correct Annotated Bibliographies database link!');
    console.log(`\n🔗 View your page: https://www.notion.so/${pageId.replace(/-/g, '')}\n`);

  } catch (error) {
    console.error('❌ Error fixing bibliographies link:', error.message);
    throw error;
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

    console.log(`📄 HUB Page ID: ${hubPageId}\n`);
    
    await fixBibliographiesLink(hubPageId);
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();

