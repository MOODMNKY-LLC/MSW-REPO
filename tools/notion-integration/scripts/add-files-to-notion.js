/**
 * Add Files to Notion Databases
 * 
 * This script adds the textbook PDF and certificate PDF to Notion databases
 * with proper metadata and file uploads. After GitHub deployment, it will
 * update the entries with GitHub URLs for file access.
 */

import { Client } from '@notionhq/client';
import { config } from 'dotenv';
import { readFileSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
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
 * Upload file to Notion and get file object
 */
async function uploadFileToNotion(filePath) {
  try {
    const fileBuffer = readFileSync(filePath);
    const fileName = basename(filePath);
    const fileSize = statSync(filePath).size;
    
    // Notion API requires files to be uploaded via their upload endpoint
    // For now, we'll create the entry with file path and upload the file separately
    // Note: Notion file uploads require the file to be accessible via URL or uploaded directly
    
    // Read file as base64 for upload
    const fileBase64 = fileBuffer.toString('base64');
    
    return {
      name: fileName,
      size: fileSize,
      path: filePath.replace(repoRoot + '\\', '').replace(/\\/g, '/'), // Relative path
      base64: fileBase64,
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Add textbook to Notion
 */
async function addTextbookToNotion(fileInfo, dataSourceId) {
  try {
    console.log(`\n📚 Adding textbook to Notion...`);
    console.log(`   File: ${fileInfo.name}`);
    console.log(`   Size: ${(fileInfo.size / 1024 / 1024).toFixed(2)} MB`);
    
    // For now, create entry with file path
    // File upload will be done manually or via Notion UI until we set up GitHub URLs
    const page = await notion.pages.create({
      parent: {
        type: 'data_source_id',
        data_source_id: dataSourceId,
      },
      properties: {
        Title: {
          title: [{ text: { content: 'SOCW-6510 Course Textbook' } }],
        },
        Type: {
          select: { name: 'Textbook' },
        },
        'File Path': {
          rich_text: [{ text: { content: fileInfo.path } }],
        },
        'Course Relevance': {
          multi_select: [{ name: 'SOCW-6510' }],
        },
        'Programmatic Access': {
          rich_text: [{ text: { content: 'Full-text PDF available for programmatic text extraction and analysis. File stored in repository at storage/textbooks/' } }],
        },
      },
      notionVersion: NOTION_API_VERSION,
    });
    
    console.log(`   ✅ Created entry: ${page.url}`);
    console.log(`   📝 Note: Upload the PDF file manually via Notion UI, or we'll add GitHub URL after deployment`);
    
    return page;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  }
}

/**
 * Add certificate to Notion (using Textbooks database for now, or create Certificates database)
 */
async function addCertificateToNotion(fileInfo, dataSourceId) {
  try {
    console.log(`\n📜 Adding certificate to Notion...`);
    console.log(`   File: ${fileInfo.name}`);
    console.log(`   Size: ${(fileInfo.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Add to Textbooks & Resources database with Type "Other" for now
    // Or we could create a separate Certificates database
    const page = await notion.pages.create({
      parent: {
        type: 'data_source_id',
        data_source_id: dataSourceId,
      },
      properties: {
        Title: {
          title: [{ text: { content: 'SOCW-6510 Training Certificate' } }],
        },
        Type: {
          select: { name: 'Other' },
        },
        'File Path': {
          rich_text: [{ text: { content: fileInfo.path } }],
        },
        'Course Relevance': {
          multi_select: [{ name: 'SOCW-6510' }],
        },
        'Programmatic Access': {
          rich_text: [{ text: { content: 'Training completion certificate. File stored in repository at storage/certificates/' } }],
        },
      },
      notionVersion: NOTION_API_VERSION,
    });
    
    console.log(`   ✅ Created entry: ${page.url}`);
    console.log(`   📝 Note: Upload the PDF file manually via Notion UI, or we'll add GitHub URL after deployment`);
    
    return page;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  }
}

/**
 * Generate GitHub URL for file (after repo is deployed)
 */
function generateGitHubUrl(filePath, repoOwner = 'YOUR_USERNAME', repoName = 'MSW-REPO', branch = 'main') {
  // GitHub raw content URL format
  return `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${filePath}`;
}

/**
 * Main function
 */
async function main() {
  try {
    const config = getConfig();
    const textbooksDatabaseId = config.academicDatabases.textbooks;
    const textbooksDataSourceId = config.dataSources[textbooksDatabaseId]?.id;
    
    if (!textbooksDataSourceId) {
      throw new Error('Textbooks database data source ID not found in config');
    }
    
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     Add Files to Notion Databases                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    
    // File paths
    const textbookPath = join(repoRoot, 'storage/textbooks/SOCW-6510-textbook.pdf');
    const certificatePath = join(repoRoot, 'storage/certificates/SOCW-6510-training-certificate.pdf');
    
    // Upload files
    const textbookInfo = await uploadFileToNotion(textbookPath);
    const certificateInfo = await uploadFileToNotion(certificatePath);
    
    // Add to Notion
    const textbookPage = await addTextbookToNotion(textbookInfo, textbooksDataSourceId);
    const certificatePage = await addCertificateToNotion(certificateInfo, textbooksDataSourceId);
    
    console.log('\n✅ Files added to Notion successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Deploy repository to GitHub');
    console.log('   2. Update entries with GitHub raw URLs for file access');
    console.log('   3. Or upload PDFs directly via Notion UI');
    console.log('\n🔗 Created entries:');
    console.log(`   Textbook: ${textbookPage.url}`);
    console.log(`   Certificate: ${certificatePage.url}`);
    console.log('\n💡 After GitHub deployment, GitHub URLs will be:');
    console.log(`   Textbook: ${generateGitHubUrl(textbookInfo.path)}`);
    console.log(`   Certificate: ${generateGitHubUrl(certificateInfo.path)}\n`);
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

