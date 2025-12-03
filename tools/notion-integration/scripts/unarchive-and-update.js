/**
 * Unarchive database/pages and update with GitHub URLs
 */

import { Client } from '@notionhq/client';
import { config } from 'dotenv';

config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;
if (!NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY environment variable is required');
}
const NOTION_API_VERSION = '2025-09-03';

const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: NOTION_API_VERSION,
});

const textbooksDatabaseId = '2becd2a6-5422-81bb-97d6-c855590f60d7';
const hubPageId = '2becd2a6-5422-8043-8939-e4bb0316a593';
const textbookPageId = '2becd2a6-5422-8196-90f3-e22473bef7d0';
const certificatePageId = '2becd2a6-5422-8118-94b8-d874aa8da7ee';

const textbookUrl = 'https://raw.githubusercontent.com/MOODMNKY-LLC/MSW-REPO/main/storage/textbooks/SOCW-6510-textbook.pdf';
const certificateUrl = 'https://raw.githubusercontent.com/MOODMNKY-LLC/MSW-REPO/main/storage/certificates/SOCW-6510-training-certificate.pdf';

async function unarchiveAndUpdate() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     Unarchive and Update Notion Entries                    ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  try {
    // Check and unarchive database
    console.log('🔍 Checking Textbooks & Resources database...');
    try {
      const database = await notion.databases.retrieve({ database_id: textbooksDatabaseId });
      if (database.archived) {
        console.log('   Database is archived, unarchiving...');
        await notion.databases.update({
          database_id: textbooksDatabaseId,
          archived: false,
        });
        console.log('   ✅ Database unarchived\n');
      } else {
        console.log('   ✅ Database is active\n');
      }
    } catch (error) {
      console.log(`   ⚠️  Could not check database: ${error.message}\n`);
    }

    // Check and unarchive HUB page
    console.log('🔍 Checking HUB page...');
    try {
      const hubPage = await notion.pages.retrieve({ page_id: hubPageId });
      if (hubPage.archived) {
        console.log('   HUB page is archived, unarchiving...');
        await notion.pages.update({
          page_id: hubPageId,
          archived: false,
        });
        console.log('   ✅ HUB page unarchived\n');
      } else {
        console.log('   ✅ HUB page is active\n');
      }
    } catch (error) {
      console.log(`   ⚠️  Could not check HUB page: ${error.message}\n`);
    }

    // Now try to update pages
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
      try {
        console.error('   Details:', JSON.parse(error.body));
      } catch (e) {
        console.error('   Details:', error.body);
      }
    }
    process.exit(1);
  }
}

unarchiveAndUpdate();

