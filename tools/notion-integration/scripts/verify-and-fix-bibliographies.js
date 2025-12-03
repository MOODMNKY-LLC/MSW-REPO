/**
 * Verify Annotated Bibliographies and Provide Fix Instructions
 * 
 * This script verifies that the bibliographies still exist and provides
 * instructions for manually adding the correct database link to the HUB page.
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
 * Verify bibliographies exist
 */
async function verifyBibliographies() {
  try {
    const config = getConfig();
    const databaseId = config.academicDatabases.bibliographies;
    const dataSourceId = config.dataSources[databaseId]?.id;

    console.log('🔍 Checking Annotated Bibliographies database...\n');
    console.log(`Database ID: ${databaseId}`);
    console.log(`Data Source ID: ${dataSourceId}\n`);

    // Query the database using data source query (2025-09-03 API)
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
    });

    console.log(`📚 Found ${response.results.length} bibliography entries:\n`);

    if (response.results.length === 0) {
      console.log('⚠️  No bibliographies found in the database!');
      console.log('   The bibliographies may have been deleted.\n');
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
    const databaseId = config.academicDatabases.bibliographies;
    const databaseUrl = `https://www.notion.so/${databaseId.replace(/-/g, '')}`;

    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     Annotated Bibliographies Verification & Fix            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    const bibliographiesExist = await verifyBibliographies();

    if (bibliographiesExist) {
      console.log('✅ Good news! Your bibliographies are still in the database.\n');
      console.log('📝 To add the correct database link to your HUB page:\n');
      console.log('   1. Open your HUB page in Notion:');
      console.log(`      https://www.notion.so/${hubPageId.replace(/-/g, '')}\n`);
      console.log('   2. Navigate to the section with database links (after Session Notes)');
      console.log('   3. Click the "+" button or type "/database"');
      console.log('   4. Select "Link to database"');
      console.log('   5. Search for "Annotated Bibliographies"');
      console.log(`   6. Select the database: ${databaseUrl}\n`);
      console.log('   OR use this direct link to copy the database:');
      console.log(`   ${databaseUrl}\n`);
      console.log('   7. Once added, delete any empty/duplicate Annotated Bibliographies links\n');
    } else {
      console.log('❌ Bibliographies not found. They may need to be recreated.\n');
    }

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();

