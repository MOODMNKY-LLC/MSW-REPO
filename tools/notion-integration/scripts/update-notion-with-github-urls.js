/**
 * Update Notion entries with GitHub URLs using Notion MCP
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
if (!NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY environment variable is required');
}
const NOTION_API_VERSION = '2025-09-03';

const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: NOTION_API_VERSION,
});

function getConfig() {
  try {
    const configPath = join(repoRoot, '.notion-config.json');
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error('Could not read .notion-config.json:', error.message);
    throw error;
  }
}

async function updateNotionEntries() {
  const textbookUrl = 'https://raw.githubusercontent.com/MOODMNKY-LLC/MSW-REPO/main/storage/textbooks/SOCW-6510-textbook.pdf';
  const certificateUrl = 'https://raw.githubusercontent.com/MOODMNKY-LLC/MSW-REPO/main/storage/certificates/SOCW-6510-training-certificate.pdf';
  
  // Page IDs from the entries we created earlier
  const textbookPageId = '2becd2a6-5422-8196-90f3-e22473bef7d0';
  const certificatePageId = '2becd2a6-5422-8118-94b8-d874aa8da7ee';
  
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     Update Notion Entries with GitHub URLs                 ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  try {
    // Update textbook entry
    console.log('📚 Updating textbook entry...');
    await notion.pages.update({
      page_id: textbookPageId,
      properties: {
        'Programmatic Access': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Full-text PDF available for programmatic text extraction and analysis.\n\nGitHub URL: ',
              },
            },
            {
              type: 'text',
              text: {
                content: textbookUrl,
                link: { url: textbookUrl },
              },
            },
          ],
        },
      },
      notionVersion: NOTION_API_VERSION,
    });
    console.log(`   ✅ Updated textbook with GitHub URL`);
    console.log(`   🔗 ${textbookUrl}\n`);
    
    // Update certificate entry
    console.log('📜 Updating certificate entry...');
    await notion.pages.update({
      page_id: certificatePageId,
      properties: {
        'Programmatic Access': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Training completion certificate.\n\nGitHub URL: ',
              },
            },
            {
              type: 'text',
              text: {
                content: certificateUrl,
                link: { url: certificateUrl },
              },
            },
          ],
        },
      },
      notionVersion: NOTION_API_VERSION,
    });
    console.log(`   ✅ Updated certificate with GitHub URL`);
    console.log(`   🔗 ${certificateUrl}\n`);
    
    console.log('✅ All updates complete!');
    console.log('\n📋 Updated Notion entries:');
    console.log(`   Textbook: https://www.notion.so/${textbookPageId.replace(/-/g, '')}`);
    console.log(`   Certificate: https://www.notion.so/${certificatePageId.replace(/-/g, '')}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.body) {
      console.error('   Details:', error.body);
    }
    throw error;
  }
}

updateNotionEntries().catch(console.error);

