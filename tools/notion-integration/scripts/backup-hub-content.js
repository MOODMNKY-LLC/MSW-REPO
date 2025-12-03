/**
 * Backup HUB Page Content
 * 
 * This script retrieves and saves the current content of the HUB page
 * before making changes. Useful for recovery if content is accidentally deleted.
 */

import { Client } from '@notionhq/client';
import { config } from 'dotenv';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '../../..');

const NOTION_API_KEY = process.env.NOTION_API_KEY;

const notion = new Client({
  auth: NOTION_API_KEY,
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
    console.error('Could not read hubPageId from config');
    return null;
  }
}

/**
 * Retrieve all blocks from HUB page
 */
async function backupHubContent() {
  try {
    const hubPageId = getHubPageId();
    
    if (!hubPageId) {
      throw new Error('HUB page ID not found in config');
    }

    console.log('Retrieving content from HUB page...\n');
    console.log(`Page ID: ${hubPageId}\n`);

    const blocks = [];
    let hasMore = true;
    let startCursor = undefined;

    // Retrieve all blocks (paginated)
    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: hubPageId,
        start_cursor: startCursor,
        page_size: 100,
      });

      blocks.push(...response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    console.log(`Found ${blocks.length} blocks\n`);

    // Save to backup file
    const backupPath = join(repoRoot, 'docs', 'hub-content-backup.json');
    const backupData = {
      timestamp: new Date().toISOString(),
      pageId: hubPageId,
      pageUrl: `https://www.notion.so/${hubPageId.replace(/-/g, '')}`,
      blocks: blocks.map(block => ({
        id: block.id,
        type: block.type,
        content: block[block.type],
        has_children: block.has_children,
      })),
    };

    writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`✅ Content backed up to: ${backupPath}`);
    console.log(`📋 Total blocks: ${blocks.length}`);

    // Also create a readable markdown version
    const markdownPath = join(repoRoot, 'docs', 'hub-content-backup.md');
    let markdown = `# HUB Page Content Backup\n\n`;
    markdown += `**Backup Date**: ${new Date().toISOString()}\n`;
    markdown += `**Page ID**: ${hubPageId}\n`;
    markdown += `**Page URL**: https://www.notion.so/${hubPageId.replace(/-/g, '')}\n\n`;
    markdown += `---\n\n`;

    for (const block of blocks) {
      const blockType = block.type;
      const content = block[blockType];
      
      if (content?.rich_text) {
        const text = content.rich_text.map(t => t.plain_text).join('');
        markdown += `## ${blockType}\n\n${text}\n\n`;
      } else if (content) {
        markdown += `## ${blockType}\n\n${JSON.stringify(content, null, 2)}\n\n`;
      }
    }

    writeFileSync(markdownPath, markdown);
    console.log(`📝 Readable backup created: ${markdownPath}`);

  } catch (error) {
    console.error('❌ Error backing up content:', error.message);
    process.exit(1);
  }
}

backupHubContent();

