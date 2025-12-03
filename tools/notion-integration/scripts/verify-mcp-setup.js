/**
 * Verify Notion MCP Setup
 * 
 * This script helps verify that the Notion MCP server is properly configured.
 * Run this to check if your setup is correct.
 */

import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '../../..');

console.log(`
╔══════════════════════════════════════════════════════════════╗
║     Notion MCP Setup Verification                            ║
╚══════════════════════════════════════════════════════════════╝
`);

// Check 1: Environment Variable
console.log('1. Checking NOTION_API_KEY environment variable...');
const apiKey = process.env.NOTION_API_KEY;
if (apiKey) {
  console.log('   ✅ NOTION_API_KEY is set');
  console.log(`   📝 Key preview: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
} else {
  console.log('   ❌ NOTION_API_KEY is not set');
  console.log('   💡 Set it with: export NOTION_API_KEY=your_token');
}

// Check 2: MCP Configuration File
console.log('\n2. Checking MCP configuration file...');
const mcpConfigPath = join(repoRoot, '.cursor/mcp.json');
if (existsSync(mcpConfigPath)) {
  console.log('   ✅ .cursor/mcp.json exists');
  try {
    const mcpConfig = JSON.parse(require('fs').readFileSync(mcpConfigPath, 'utf8'));
    if (mcpConfig.mcpServers?.notion) {
      console.log('   ✅ Notion MCP server is configured');
    } else {
      console.log('   ⚠️  Notion MCP server not found in configuration');
    }
  } catch (error) {
    console.log('   ⚠️  Could not parse mcp.json');
  }
} else {
  console.log('   ⚠️  .cursor/mcp.json not found');
  console.log('   💡 Copy mcp.json.example to .cursor/mcp.json');
}

// Check 3: Example Config
console.log('\n3. Checking example configuration...');
const exampleConfigPath = join(repoRoot, 'mcp.json.example');
if (existsSync(exampleConfigPath)) {
  console.log('   ✅ mcp.json.example exists');
} else {
  console.log('   ⚠️  mcp.json.example not found');
}

// Check 4: Docker (if using Docker-based MCP)
console.log('\n4. Checking Docker (for Docker-based MCP)...');
try {
  const { execSync } = require('child_process');
  execSync('docker --version', { stdio: 'ignore' });
  console.log('   ✅ Docker is installed');
  
  // Check if Docker is running
  try {
    execSync('docker ps', { stdio: 'ignore' });
    console.log('   ✅ Docker is running');
  } catch {
    console.log('   ⚠️  Docker is installed but not running');
    console.log('   💡 Start Docker Desktop');
  }
} catch {
  console.log('   ⚠️  Docker not found (required for Docker-based MCP)');
  console.log('   💡 Install Docker Desktop or use npx-based MCP');
}

// Summary
console.log(`
╔══════════════════════════════════════════════════════════════╗
║     Setup Summary                                            ║
╚══════════════════════════════════════════════════════════════╝
`);

if (apiKey) {
  console.log('✅ Environment variable is set');
  console.log('\n📋 Next steps:');
  console.log('   1. Ensure your Notion workspace is shared with the integration');
  console.log('   2. Restart Cursor IDE to load the environment variable');
  console.log('   3. Use Cursor chat to test: "Search for databases in my Notion workspace"');
} else {
  console.log('❌ Environment variable is NOT set');
  console.log('\n📋 Setup steps:');
  console.log('   1. Get integration token from https://www.notion.so/my-integrations');
  console.log('   2. Set environment variable:');
  console.log('      Windows PowerShell: $env:NOTION_API_KEY = "your_token"');
  console.log('      Linux/Mac: export NOTION_API_KEY=your_token');
  console.log('   3. Restart Cursor IDE');
  console.log('   4. Run this script again to verify');
}

console.log(`
📚 Documentation:
   - Quick Start: SETUP_NOTION_VIA_MCP.md
   - Detailed Guide: docs/MCP_NOTION_SETUP.md
   - Integration Guide: docs/NOTION_INTEGRATION.md
   - Chat Prompts: tools/notion-integration/scripts/mcp-sync-helper.md
`);

