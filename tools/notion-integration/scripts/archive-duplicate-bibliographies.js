/**
 * Archive Duplicate Annotated Bibliographies
 * 
 * This script archives duplicate bibliography entries, keeping only the oldest entry
 * for each unique Topic/Course combination.
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

// Duplicate entries to archive (keeping the oldest ones)
const duplicatesToArchive = [
  // "Attachment Theory in Clinical Social Work Practice" duplicates
  // Keep: 2becd2a6-5422-8153-beed-ecb6a87892fd (oldest - created 17:40:57)
  '2becd2a6-5422-8154-9edb-ec2399b4eb00', // created 17:48:36
  '2becd2a6-5422-8170-84d4-f8767607f822', // created 17:48:36
  
  // "Attachment Theory in Child and Family Social Work" duplicates
  // Keep: 2becd2a6-5422-819e-b5ee-d0eb8d5cb95e (oldest - created 17:40:57)
  '2becd2a6-5422-8132-b302-dfd39cb5ead4', // created 17:48:36
  '2becd2a6-5422-815c-80d7-e959f5f72239', // created 17:48:38
];

async function archiveDuplicates() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     Archive Duplicate Annotated Bibliographies            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  console.log(`📋 Found ${duplicatesToArchive.length} duplicate entries to archive\n`);

  let archived = 0;
  let failed = 0;

  for (const pageId of duplicatesToArchive) {
    try {
      // Archive the page
      await notion.pages.update({
        page_id: pageId,
        archived: true,
      });
      console.log(`   ✅ Archived: ${pageId.substring(0, 8)}...`);
      archived++;
    } catch (error) {
      console.error(`   ❌ Failed to archive ${pageId.substring(0, 8)}...: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n✅ Cleanup complete!`);
  console.log(`   Archived: ${archived} entries`);
  if (failed > 0) {
    console.log(`   Failed: ${failed} entries`);
  }
  console.log(`\n📚 Remaining entries:`);
  console.log(`   ✅ Attachment Theory in Clinical Social Work Practice (${duplicatesToArchive[0].substring(0, 8)}...)`);
  console.log(`   ✅ Attachment Theory in Child and Family Social Work (${duplicatesToArchive[2].substring(0, 8)}...)`);
  console.log(`\n🔗 View database: https://www.notion.so/2becd2a654228122b027ebf51261d743\n`);
}

archiveDuplicates().catch(console.error);

