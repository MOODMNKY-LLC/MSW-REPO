/**
 * Clean Duplicate Database Sections
 * 
 * Removes the old toggle-based database section and keeps only the new callout-based format.
 */

import { Client } from '@notionhq/client';
import { config } from 'dotenv';

config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_API_VERSION = '2025-09-03';

const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: NOTION_API_VERSION,
});

async function cleanPage(pageId) {
  try {
    // Get all blocks
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

    // Find and remove toggle-based "Quick Access" section (old format)
    // Keep only the callout-based format (new format)
    let inToggleSection = false;
    let toggleSectionStart = -1;
    const blocksToDelete = [];

    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      
      // Look for "Quick Access" heading
      if (block.type === 'heading_2' && block.heading_2?.rich_text?.[0]?.plain_text?.includes('Quick Access')) {
        // Check if next blocks are toggles (old format) or callouts (new format)
        if (i + 1 < allBlocks.length && allBlocks[i + 1].type === 'toggle') {
          // This is the old toggle format - mark for deletion
          toggleSectionStart = i;
          inToggleSection = true;
        } else {
          // This is the new callout format - keep it
          inToggleSection = false;
        }
      }
      
      // If we're in the toggle section, mark blocks for deletion
      if (inToggleSection && toggleSectionStart >= 0 && i >= toggleSectionStart) {
        // Stop at next heading_2 or heading_1 that's not part of this section
        if (i > toggleSectionStart && 
            (block.type === 'heading_1' || 
             (block.type === 'heading_2' && !block.heading_2?.rich_text?.[0]?.plain_text?.includes('Quick Access')) ||
             (block.type === 'heading_3' && block.heading_3?.rich_text?.[0]?.plain_text?.includes('View All Articles')))) {
          break;
        }
        blocksToDelete.push(block.id);
      }
    }

    // Delete duplicate blocks
    for (const blockId of blocksToDelete) {
      try {
        await notion.blocks.delete({ block_id: blockId });
      } catch (error) {
        // Ignore errors
      }
    }

    console.log(`   ✅ Removed ${blocksToDelete.length} duplicate blocks`);
  } catch (error) {
    console.error(`   ⚠️  Could not clean: ${error.message}`);
  }
}

async function main() {
  const clinicalBibId = '2becd2a6-5422-8153-beed-ecb6a87892fd';
  const childFamilyBibId = '2becd2a6-5422-819e-b5ee-d0eb8d5cb95e';

  console.log('Cleaning duplicate database sections...\n');
  
  console.log('📚 Clinical Social Work Practice:');
  await cleanPage(clinicalBibId);
  
  console.log('\n📚 Child and Family Social Work:');
  await cleanPage(childFamilyBibId);
  
  console.log('\n✅ Cleanup complete!');
}

main();

