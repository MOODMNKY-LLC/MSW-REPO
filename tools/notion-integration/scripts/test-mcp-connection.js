/**
 * Test Notion MCP Connection
 * 
 * This script tests both OAuth-based and API key-based MCP connections
 * to help diagnose MCP authentication issues.
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

/**
 * Test Direct API Connection
 */
async function testDirectAPI() {
  console.log('🔍 Testing Direct API Connection...\n');
  
  try {
    const notion = new Client({
      auth: NOTION_API_KEY,
      notionVersion: '2025-09-03',
    });
    
    // Test: Get self (bot user)
    const self = await notion.users.me();
    console.log('✅ Direct API Connection: SUCCESS');
    console.log(`   Bot User: ${self.name || 'Unknown'}`);
    console.log(`   Bot ID: ${self.id}\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Direct API Connection: FAILED');
    console.error(`   Error: ${error.message}\n`);
    return false;
  }
}

/**
 * Test Database Access
 */
async function testDatabaseAccess() {
  console.log('🔍 Testing Database Access...\n');
  
  try {
    const configPath = join(repoRoot, '.notion-config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    
    const notion = new Client({
      auth: NOTION_API_KEY,
      notionVersion: '2025-09-03',
    });
    
    // Test: Access main database
    if (config.databaseId) {
      const database = await notion.databases.retrieve({
        database_id: config.databaseId,
      });
      
      console.log('✅ Database Access: SUCCESS');
      console.log(`   Database: ${database.title[0]?.plain_text || 'Unknown'}`);
      console.log(`   Database ID: ${config.databaseId}`);
      
      if (config.dataSources && config.dataSources[config.databaseId]) {
        console.log(`   Data Source ID: ${config.dataSources[config.databaseId].id}`);
      }
      console.log();
      
      return true;
    } else {
      console.log('⚠️  No database ID found in config\n');
      return false;
    }
  } catch (error) {
    console.error('❌ Database Access: FAILED');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.code === 'object_not_found') {
      console.error('   💡 Tip: Database may not be shared with integration');
    }
    
    return false;
  }
}

/**
 * Test Data Source Access
 */
async function testDataSourceAccess() {
  console.log('🔍 Testing Data Source Access (2025-09-03)...\n');
  
  try {
    const configPath = join(repoRoot, '.notion-config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    
    const notion = new Client({
      auth: NOTION_API_KEY,
      notionVersion: '2025-09-03',
    });
    
    if (config.databaseId && config.dataSources && config.dataSources[config.databaseId]) {
      const dataSourceId = config.dataSources[config.databaseId].id;
      
      const dataSource = await notion.dataSources.retrieve({
        data_source_id: dataSourceId,
      });
      
      console.log('✅ Data Source Access: SUCCESS');
      console.log(`   Data Source: ${dataSource.title[0]?.plain_text || 'Unknown'}`);
      console.log(`   Data Source ID: ${dataSourceId}\n`);
      
      return true;
    } else {
      console.log('⚠️  No data source ID found in config');
      console.log('   Run: pnpm run migrate\n');
      return false;
    }
  } catch (error) {
    console.error('❌ Data Source Access: FAILED');
    console.error(`   Error: ${error.message}\n`);
    return false;
  }
}

/**
 * Test MCP Server Compatibility
 */
function testMCPCompatibility() {
  console.log('🔍 Testing MCP Server Compatibility...\n');
  
  console.log('📋 MCP Configuration Options:\n');
  
  console.log('Option 1: Official Notion Hosted MCP (OAuth)');
  console.log('   ✅ Recommended if Cursor supports OAuth');
  console.log('   ✅ One-click setup');
  console.log('   ✅ No API keys needed');
  console.log('   ⚠️  Requires Cursor OAuth support\n');
  
  console.log('Option 2: Open-Source MCP Server (API Key)');
  console.log('   ✅ Works with API keys');
  console.log('   ✅ More control');
  console.log('   ⚠️  Requires @modelcontextprotocol/server-notion package\n');
  
  console.log('Option 3: Direct API Calls (Current Setup)');
  console.log('   ✅ Already working');
  console.log('   ✅ Full control');
  console.log('   ✅ No MCP server needed\n');
  
  return true;
}

/**
 * Main function
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     Notion MCP Connection Test                                ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  const results = {
    directAPI: await testDirectAPI(),
    databaseAccess: await testDatabaseAccess(),
    dataSourceAccess: await testDataSourceAccess(),
    mcpCompatibility: testMCPCompatibility(),
  };
  
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     Test Results Summary                                     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  console.log(`Direct API:        ${results.directAPI ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Database Access:   ${results.databaseAccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Data Source Access: ${results.dataSourceAccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`MCP Compatibility:  ${results.mcpCompatibility ? '✅ INFO' : '❌ FAIL'}\n`);
  
  if (results.directAPI && results.databaseAccess && results.dataSourceAccess) {
    console.log('✅ All API tests passed!');
    console.log('\n💡 For MCP Server:');
    console.log('   1. Check if Cursor supports OAuth-based MCP');
    console.log('   2. If yes, use Official Notion Hosted MCP');
    console.log('   3. If no, use open-source server with API key');
    console.log('   4. See docs/NOTION_MCP_OAUTH_SETUP.md for details\n');
  } else {
    console.log('⚠️  Some tests failed. Check errors above.\n');
  }
}

main().catch(console.error);

