/**
 * Remove Duplicate Annotated Bibliographies
 * 
 * This script analyzes the Annotated Bibliographies database,
 * identifies duplicates based on Topic, Course, and other properties,
 * and removes duplicates while keeping the best entry for each unique bibliography.
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
 * Fetch all entries from the database
 */
async function fetchAllEntries(databaseId) {
  let allEntries = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      page_size: 100,
    });

    allEntries = allEntries.concat(response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }

  return allEntries;
}

/**
 * Analyze entries and identify duplicates
 */
function identifyDuplicates(entries) {
  const grouped = {};
  const duplicates = [];

  for (const entry of entries) {
    const topic = entry.properties?.Topic?.title?.[0]?.plain_text || 'Untitled';
    const course = entry.properties?.Course?.select?.name || '';
    const status = entry.properties?.Status?.select?.name || '';
    const dueDate = entry.properties?.['Due Date']?.date?.start || '';
    const created = entry.created_time || '';
    
    // Create a unique key based on topic and course
    const key = `${topic}::${course}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push({
      id: entry.id,
      url: entry.url,
      topic,
      course,
      status,
      dueDate,
      created,
      hasFile: entry.properties?.File?.files?.length > 0,
      entry,
    });
  }

  // Find duplicates (groups with more than one entry)
  for (const [key, entries] of Object.entries(grouped)) {
    if (entries.length > 1) {
      duplicates.push({
        key,
        entries: entries.sort((a, b) => new Date(a.created) - new Date(b.created)), // Sort by creation date
      });
    }
  }

  return { grouped, duplicates };
}

/**
 * Determine which entry to keep (prefer entries with files, then newer ones)
 */
function selectBestEntry(entries) {
  // Prefer entries with files
  const withFiles = entries.filter(e => e.hasFile);
  if (withFiles.length > 0) {
    return withFiles[0]; // Keep the first one with a file
  }

  // Otherwise, keep the most recently created (last in sorted array)
  return entries[entries.length - 1];
}

/**
 * Delete duplicate entries
 */
async function removeDuplicates(databaseId) {
  try {
    console.log('🔍 Fetching all entries from database...\n');
    const allEntries = await fetchAllEntries(databaseId);
    console.log(`📋 Found ${allEntries.length} total entries\n`);

    console.log('🔍 Analyzing entries for duplicates...\n');
    const { grouped, duplicates } = identifyDuplicates(allEntries);

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found! Database is clean.\n');
      return;
    }

    console.log(`⚠️  Found ${duplicates.length} duplicate group(s):\n`);

    const toDelete = [];

    for (const { key, entries } of duplicates) {
      const [topic, course] = key.split('::');
      console.log(`📚 "${topic}" (${course})`);
      console.log(`   Found ${entries.length} duplicate(s):`);

      const bestEntry = selectBestEntry(entries);
      console.log(`   ✅ Keeping: ${bestEntry.id.substring(0, 8)}... (created: ${new Date(bestEntry.created).toLocaleDateString()})`);

      for (const entry of entries) {
        if (entry.id !== bestEntry.id) {
          console.log(`   🗑️  Will delete: ${entry.id.substring(0, 8)}... (created: ${new Date(entry.created).toLocaleDateString()})`);
          toDelete.push(entry);
        }
      }
      console.log('');
    }

    if (toDelete.length === 0) {
      console.log('✅ No duplicates to remove.\n');
      return;
    }

    console.log(`\n🗑️  Deleting ${toDelete.length} duplicate entry/entries...\n`);

    let deleted = 0;
    let failed = 0;

    for (const entry of toDelete) {
      try {
        await notion.pages.update({
          page_id: entry.id,
          archived: true,
        });
        console.log(`   ✅ Deleted: ${entry.topic} (${entry.id.substring(0, 8)}...)`);
        deleted++;
      } catch (error) {
        console.error(`   ❌ Failed to delete ${entry.id.substring(0, 8)}...: ${error.message}`);
        failed++;
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   Deleted: ${deleted} entries`);
    if (failed > 0) {
      console.log(`   Failed: ${failed} entries`);
    }
    console.log(`\n🔗 View database: https://www.notion.so/${databaseId.replace(/-/g, '')}\n`);

  } catch (error) {
    console.error('❌ Error removing duplicates:', error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config = getConfig();
    const databaseId = config.academicDatabases.bibliographies;
    
    if (!databaseId) {
      throw new Error('bibliographies database ID not found in config');
    }

    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     Remove Duplicate Annotated Bibliographies               ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log(`📄 Database ID: ${databaseId}\n`);

    await removeDuplicates(databaseId);

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();

