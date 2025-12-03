/**
 * Add Database Section to Bibliography Pages
 * 
 * This script adds a database/table section at the bottom of each bibliography page
 * with all citations and direct links to full-text versions.
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
 * Parse articles from markdown section
 */
function parseArticles(markdownSection) {
  const articles = [];
  const articleParts = markdownSection.split(/### Article \d+/).slice(1);
  
  articleParts.forEach((articlePart, index) => {
    // Extract citation
    const citationMatch = articlePart.match(/\*\*(.*?)\*\*/);
    const citation = citationMatch ? citationMatch[1].trim() : '';
    
    // Extract full-text URL
    const urlMatch = articlePart.match(/\*\*Full-text available at:\*\*\s*(https:\/\/[^\s\n]+)/);
    const fullTextUrl = urlMatch ? urlMatch[1].trim() : '';
    
    if (citation && fullTextUrl) {
      articles.push({
        number: index + 1,
        citation,
        fullTextUrl,
      });
    }
  });
  
  return articles;
}

/**
 * Create database section blocks
 */
function createDatabaseSectionBlocks(articles, articlesDatabaseId) {
  const blocks = [];
  
  // Section heading
  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{
        type: 'text',
        text: { content: '📚 Quick Access: Citations & Full-Text Links' },
      }],
    },
  });
  
  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{
        type: 'text',
        text: { content: 'All citations and direct links to full-text versions are listed below for easy access:' },
      }],
    },
  });
  
  // Create a numbered list with callout blocks for each article (easier to scan)
  articles.forEach((article) => {
    // Article number and citation
    blocks.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{
          type: 'text',
          text: { content: `Article ${article.number}` },
        }],
      },
    });
    
    // Citation in a callout block
    blocks.push({
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: [{
          type: 'text',
          text: { content: article.citation },
        }],
        icon: {
          emoji: '📄',
        },
      },
    });
    
    // Full-text link as a prominent button-like block
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: { content: '🔗 ' },
        }, {
          type: 'text',
          text: { content: 'Full-text available here' },
          annotations: { bold: true },
          href: article.fullTextUrl,
        }, {
          type: 'text',
          text: { content: ` (${article.fullTextUrl})` },
        }],
      },
    });
    
    blocks.push({
      object: 'block',
      type: 'divider',
      divider: {},
    });
  });
  
  blocks.push({
    object: 'block',
    type: 'divider',
    divider: {},
  });
  
  // Link to Articles database
  blocks.push({
    object: 'block',
    type: 'heading_3',
    heading_3: {
      rich_text: [{
        type: 'text',
        text: { content: '📑 View All Articles in Database' },
      }],
    },
  });
  
  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{
        type: 'text',
        text: { content: 'For detailed article information including summaries, strengths, weaknesses, and additional metadata, visit the Articles database:' },
      }],
    },
  });
  
  const articlesDbUrl = `https://www.notion.so/${articlesDatabaseId.replace(/-/g, '')}`;
  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{
        type: 'text',
        text: { content: articlesDbUrl },
        annotations: { bold: true },
        href: articlesDbUrl,
      }],
    },
  });
  
  return blocks;
}

/**
 * Add database section to bibliography page
 */
async function addDatabaseSection(pageId, markdownSection, articlesDatabaseId) {
  try {
    console.log(`\n📝 Adding database section to bibliography page...`);
    
    // Parse articles
    const articles = parseArticles(markdownSection);
    console.log(`   Found ${articles.length} articles`);
    
    // Create blocks
    const blocks = createDatabaseSectionBlocks(articles, articlesDatabaseId);
    
    // Append to page
    await notion.blocks.children.append({
      block_id: pageId,
      children: blocks,
    });
    
    console.log(`   ✅ Added database section with ${articles.length} article entries`);
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config = getConfig();
    const articlesDatabaseId = config.academicDatabases.articles;
    
    // Read markdown file
    const markdownPath = join(repoRoot, 'storage/bibliographies/attachment-theory-annotated-bibliographies.md');
    const markdownContent = readFileSync(markdownPath, 'utf8');
    
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     Add Database Section to Bibliography Pages            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    // Bibliography page IDs
    const clinicalBibId = '2becd2a6-5422-8153-beed-ecb6a87892fd';
    const childFamilyBibId = '2becd2a6-5422-819e-b5ee-d0eb8d5cb95e';
    
    // Extract sections
    const clinicalSection = markdownContent.split('## Bibliography 1:')[1]?.split('## Bibliography 2:')[0] || '';
    const childFamilySection = markdownContent.split('## Bibliography 2:')[1]?.split('## Notes on Article Selection')[0] || '';
    
    // Add database section to Clinical Social Work Practice bibliography
    if (clinicalSection) {
      console.log('📚 Processing: Attachment Theory in Clinical Social Work Practice');
      await addDatabaseSection(clinicalBibId, clinicalSection, articlesDatabaseId);
    }
    
    // Add database section to Child and Family Social Work bibliography
    if (childFamilySection) {
      console.log('\n📚 Processing: Attachment Theory in Child and Family Social Work');
      await addDatabaseSection(childFamilyBibId, childFamilySection, articlesDatabaseId);
    }
    
    console.log('\n✅ Database sections added successfully!');
    console.log(`\n🔗 View bibliographies:`);
    console.log(`   Clinical: https://www.notion.so/${clinicalBibId.replace(/-/g, '')}`);
    console.log(`   Child & Family: https://www.notion.so/${childFamilyBibId.replace(/-/g, '')}\n`);
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

