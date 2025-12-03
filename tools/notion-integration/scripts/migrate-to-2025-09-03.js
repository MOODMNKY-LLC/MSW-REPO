/**
 * Migrate Notion Integration to API Version 2025-09-03
 * 
 * This script:
 * 1. Discovers data source IDs for all databases
 * 2. Updates .notion-config.json with data source IDs
 * 3. Verifies all databases are accessible
 * 
 * Based on: https://developers.notion.com/docs/upgrade-guide-2025-09-03
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createNotionClient, getDataSourceId, getDataSources } from './notion-api-helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '../../..');

/**
 * Get config file path
 */
function getConfigPath() {
  return join(repoRoot, '.notion-config.json');
}

/**
 * Load current config
 */
function loadConfig() {
  try {
    const configPath = getConfigPath();
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error('Error loading config:', error.message);
    return {};
  }
}

/**
 * Save config
 */
function saveConfig(config) {
  const configPath = getConfigPath();
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

/**
 * Migrate database IDs to data source IDs
 */
async function migrateDatabases() {
  console.log('🔄 Migrating to Notion API 2025-09-03...\n');
  
  const config = loadConfig();
  const notion = createNotionClient();
  
  // Ensure dataSources object exists
  if (!config.dataSources) {
    config.dataSources = {};
  }
  
  // List of database IDs to migrate
  const databasesToMigrate = [];
  
  // Add main database
  if (config.databaseId) {
    databasesToMigrate.push({
      id: config.databaseId,
      name: 'MSW-REPO Academic Files',
      key: 'databaseId',
    });
  }
  
  // Add academic databases
  if (config.academicDatabases) {
    Object.entries(config.academicDatabases).forEach(([key, id]) => {
      databasesToMigrate.push({
        id,
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        key: `academicDatabases.${key}`,
      });
    });
  }
  
  console.log(`Found ${databasesToMigrate.length} databases to migrate\n`);
  
  // Migrate each database
  for (const db of databasesToMigrate) {
    try {
      console.log(`📋 Migrating: ${db.name} (${db.id})`);
      
      // Get data sources
      const dataSources = await getDataSources(db.id);
      
      if (dataSources.length === 0) {
        console.log(`   ⚠️  No data sources found, skipping`);
        continue;
      }
      
      // Use first data source (default)
      const dataSource = dataSources[0];
      console.log(`   ✅ Data Source ID: ${dataSource.id}`);
      console.log(`   📝 Name: ${dataSource.name || 'Default'}`);
      
      // Store in config
      config.dataSources[db.id] = {
        id: dataSource.id,
        name: dataSource.name || 'Default',
        databaseId: db.id,
      };
      
      // If multiple data sources, log them
      if (dataSources.length > 1) {
        console.log(`   ℹ️  Found ${dataSources.length} data sources (using first)`);
        dataSources.forEach((ds, idx) => {
          if (idx > 0) {
            console.log(`      - ${ds.name || 'Unnamed'}: ${ds.id}`);
          }
        });
      }
      
    } catch (error) {
      console.error(`   ❌ Error migrating ${db.name}:`, error.message);
      if (error.code === 'object_not_found') {
        console.error(`      Database may not be accessible to integration`);
      }
    }
  }
  
  // Save updated config
  saveConfig(config);
  
  console.log('\n✅ Migration complete!');
  console.log('📊 Data source IDs saved to .notion-config.json');
  console.log('\n💡 Next steps:');
  console.log('   1. Update scripts to use data_source_id instead of database_id');
  console.log('   2. Test all database operations');
  console.log('   3. Update MCP server configuration if needed');
}

/**
 * Verify migration
 */
async function verifyMigration() {
  console.log('\n🔍 Verifying migration...\n');
  
  const config = loadConfig();
  const notion = createNotionClient();
  
  if (!config.dataSources || Object.keys(config.dataSources).length === 0) {
    console.log('⚠️  No data sources found in config');
    return;
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [databaseId, dataSource] of Object.entries(config.dataSources)) {
    try {
      const ds = await notion.dataSources.retrieve({
        data_source_id: dataSource.id,
      });
      
      console.log(`✅ ${dataSource.name || databaseId}: Accessible`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${dataSource.name || databaseId}: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n📊 Verification Results: ${successCount} successful, ${failCount} failed`);
}

/**
 * Main function
 */
async function main() {
  try {
    await migrateDatabases();
    await verifyMigration();
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

main();

