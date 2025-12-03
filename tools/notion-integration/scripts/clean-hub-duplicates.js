/**
 * Clean HUB Page Duplicates
 * 
 * This script removes duplicate database links and duplicate content sections
 * from the HUB page in Notion.
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
 * Get HUB page ID from config
 */
function getHubPageId() {
  try {
    const configPath = join(repoRoot, '.notion-config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    return config.hubPageId;
  } catch (error) {
    console.error('Could not read hubPageId from config:', error.message);
    throw error;
  }
}

/**
 * Clean duplicate database links and content
 */
async function cleanHubPage(pageId) {
  try {
    console.log('🔍 Analyzing HUB page content...\n');

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

    // Track database links we've seen
    const seenDatabaseUrls = new Set();
    const seenDatabaseIds = new Set();
    const seenDataSourceIds = new Set(); // Track by data source ID
    const seenDatabaseNames = new Set(); // Track by database name (title)
    const blocksToDelete = [];
    const seenContentSections = new Map(); // Track content by text hash

    // Analyze blocks
    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i];

      // Check for database blocks (child_database type)
      if (block.type === 'child_database') {
        const childDb = block.child_database || {};
        const databaseId = childDb.database_id;
        const dataSourceId = childDb.data_source_id;
        const title = childDb.title || 'Unknown';
        
        // Track by database name first (simplest way to catch duplicates)
        // If we've seen this database name before, it's likely a duplicate
        if (seenDatabaseNames.has(title)) {
          console.log(`🗑️  Found duplicate database block at index ${i}: "${title}"`);
          blocksToDelete.push({ index: i, block_id: block.id, reason: 'duplicate_database_name' });
        } else {
          // Also track by IDs if available for more precise matching
          seenDatabaseNames.add(title);
          if (dataSourceId) {
            seenDataSourceIds.add(dataSourceId);
          }
          if (databaseId) {
            seenDatabaseIds.add(databaseId);
          }
          console.log(`✅ Keeping database block at index ${i}: "${title}"`);
        }
      }
      
      // Check for synced blocks that might contain databases
      if (block.type === 'synced_block') {
        const syncedFrom = block.synced_block?.synced_from?.block_id;
        if (syncedFrom && seenDatabaseIds.has(syncedFrom)) {
          console.log(`🗑️  Found duplicate synced block at index ${i}`);
          blocksToDelete.push({ index: i, block_id: block.id, reason: 'duplicate_synced_block' });
        } else if (syncedFrom) {
          seenDatabaseIds.add(syncedFrom);
        }
      }

      // Check for duplicate content sections (heading + content)
      if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
        const headingText = block[block.type]?.rich_text?.[0]?.plain_text || '';
        
        // Check if we've seen this heading before
        if (seenContentSections.has(headingText)) {
          // Found duplicate heading - mark this and following blocks for deletion
          const previousIndex = seenContentSections.get(headingText);
          console.log(`🗑️  Found duplicate section "${headingText}" at index ${i} (previous at ${previousIndex})`);
          
          // Mark this heading and following blocks until next major heading
          let j = i;
          while (j < allBlocks.length) {
            const nextBlock = allBlocks[j];
            const nextType = nextBlock.type;
            
            // Stop at next major heading
            if (j > i && (nextType === 'heading_1' || nextType === 'heading_2')) {
              break;
            }
            
            blocksToDelete.push({ index: j, block_id: nextBlock.id, reason: 'duplicate_section' });
            j++;
          }
        } else {
          seenContentSections.set(headingText, i);
        }
      }
    }

    // Sort blocks to delete by index (descending) to avoid index shifting issues
    blocksToDelete.sort((a, b) => b.index - a.index);

    console.log(`\n📊 Summary:`);
    console.log(`   Total blocks: ${allBlocks.length}`);
    console.log(`   Blocks to delete: ${blocksToDelete.length}`);
    console.log(`   Unique databases: ${seenDatabaseIds.size}\n`);

    if (blocksToDelete.length === 0) {
      console.log('✅ No duplicates found! HUB page is clean.\n');
      return;
    }

    // Delete duplicate blocks
    console.log('🗑️  Deleting duplicate blocks...\n');
    let deletedCount = 0;
    let errorCount = 0;

    for (const { block_id, reason } of blocksToDelete) {
      try {
        await notion.blocks.delete({
          block_id: block_id,
        });
        deletedCount++;
        if (deletedCount % 10 === 0) {
          console.log(`   Deleted ${deletedCount} blocks...`);
        }
      } catch (error) {
        // Some blocks can't be deleted (like certain synced blocks)
        if (error.message.includes('Cannot delete') || error.message.includes('validation_error')) {
          console.warn(`   ⚠️  Could not delete block ${block_id.substring(0, 8)}... (${reason})`);
        } else {
          console.error(`   ❌ Error deleting block ${block_id.substring(0, 8)}...:`, error.message);
          errorCount++;
        }
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   Deleted: ${deletedCount} blocks`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount} blocks`);
    }
    console.log(`\n🔗 View your page: https://www.notion.so/${pageId.replace(/-/g, '')}\n`);

  } catch (error) {
    console.error('❌ Error cleaning HUB page:', error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const hubPageId = getHubPageId();
    console.log(`📄 HUB Page ID: ${hubPageId}\n`);
    
    await cleanHubPage(hubPageId);
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();

