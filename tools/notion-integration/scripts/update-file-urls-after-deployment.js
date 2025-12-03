/**
 * Update Notion File URLs After GitHub Deployment
 * 
 * This script updates Notion database entries with GitHub raw URLs
 * after the repository has been deployed to GitHub.
 * 
 * Usage:
 *   node tools/notion-integration/scripts/update-file-urls-after-deployment.js <github-username> <repo-name> <branch>
 * 
 * Example:
 *   node tools/notion-integration/scripts/update-file-urls-after-deployment.js yourusername MSW-REPO main
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
 * Generate GitHub raw URL
 */
function generateGitHubUrl(filePath, repoOwner, repoName, branch = 'main') {
  return `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${filePath}`;
}

/**
 * Update textbook entry with GitHub URL
 */
async function updateTextbookUrl(pageId, githubUrl) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Programmatic Access': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Full-text PDF available for programmatic text extraction and analysis.\n\nGitHub URL: `,
              },
            },
            {
              type: 'text',
              text: {
                content: githubUrl,
                link: { url: githubUrl },
              },
            },
          ],
        },
      },
      notionVersion: NOTION_API_VERSION,
    });
    console.log(`   ✅ Updated textbook entry with GitHub URL`);
  } catch (error) {
    console.error(`   ❌ Error updating textbook: ${error.message}`);
  }
}

/**
 * Update certificate entry with GitHub URL
 */
async function updateCertificateUrl(pageId, githubUrl) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Programmatic Access': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Training completion certificate.\n\nGitHub URL: `,
              },
            },
            {
              type: 'text',
              text: {
                content: githubUrl,
                link: { url: githubUrl },
              },
            },
          ],
        },
      },
      notionVersion: NOTION_API_VERSION,
    });
    console.log(`   ✅ Updated certificate entry with GitHub URL`);
  } catch (error) {
    console.error(`   ❌ Error updating certificate: ${error.message}`);
  }
}

/**
 * Find pages by title
 */
async function findPageByTitle(databaseId, title) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Title',
        title: {
          contains: title,
        },
      },
    });
    
    return response.results.length > 0 ? response.results[0] : null;
  } catch (error) {
    console.error(`Error finding page: ${error.message}`);
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    const repoOwner = args[0] || 'YOUR_USERNAME';
    const repoName = args[1] || 'MSW-REPO';
    const branch = args[2] || 'main';
    
    if (repoOwner === 'YOUR_USERNAME') {
      console.log('⚠️  Please provide GitHub username, repo name, and branch:');
      console.log('   Usage: node update-file-urls-after-deployment.js <username> <repo-name> <branch>');
      console.log('   Example: node update-file-urls-after-deployment.js yourusername MSW-REPO main\n');
      return;
    }
    
    const config = getConfig();
    const textbooksDatabaseId = config.academicDatabases.textbooks;
    
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     Update Notion File URLs After Deployment              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    console.log(`📦 Repository: ${repoOwner}/${repoName} (${branch})\n`);
    
    // Generate GitHub URLs
    const textbookUrl = generateGitHubUrl('storage/textbooks/SOCW-6510-textbook.pdf', repoOwner, repoName, branch);
    const certificateUrl = generateGitHubUrl('storage/certificates/SOCW-6510-training-certificate.pdf', repoOwner, repoName, branch);
    
    console.log('🔗 Generated URLs:');
    console.log(`   Textbook: ${textbookUrl}`);
    console.log(`   Certificate: ${certificateUrl}\n`);
    
    // Find and update textbook entry
    console.log('📚 Updating textbook entry...');
    const textbookPage = await findPageByTitle(textbooksDatabaseId, 'SOCW-6510 Course Textbook');
    if (textbookPage) {
      await updateTextbookUrl(textbookPage.id, textbookUrl);
    } else {
      console.log('   ⚠️  Textbook entry not found');
    }
    
    // Find and update certificate entry
    console.log('\n📜 Updating certificate entry...');
    const certificatePage = await findPageByTitle(textbooksDatabaseId, 'SOCW-6510 Training Certificate');
    if (certificatePage) {
      await updateCertificateUrl(certificatePage.id, certificateUrl);
    } else {
      console.log('   ⚠️  Certificate entry not found');
    }
    
    console.log('\n✅ URL updates complete!');
    console.log('\n💡 Files are now accessible via GitHub raw URLs in Notion.\n');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

