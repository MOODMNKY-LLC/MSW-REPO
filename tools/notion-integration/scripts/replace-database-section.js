/**
 * Replace Database Section with Callout Format
 * 
 * Removes the old toggle-based section and replaces it with callout-based format.
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

function parseArticles(markdownSection) {
  const articles = [];
  const articleParts = markdownSection.split(/### Article \d+/).slice(1);
  
  articleParts.forEach((articlePart, index) => {
    const citationMatch = articlePart.match(/\*\*(.*?)\*\*/);
    const citation = citationMatch ? citationMatch[1].trim() : '';
    
    const urlMatch = articlePart.match(/\*\*Full-text available at:\*\*\s*(https:\/\/[^\s\n]+)/);
    const fullTextUrl = urlMatch ? urlMatch[1].trim() : '';
    
    if (citation && fullTextUrl) {
      articles.push({ number: index + 1, citation, fullTextUrl });
    }
  });
  
  return articles;
}

function createCalloutBlocks(articles, articlesDatabaseId) {
  const blocks = [];
  
  articles.forEach((article) => {
    blocks.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{ type: 'text', text: { content: `Article ${article.number}` } }],
      },
    });
    
    blocks.push({
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: [{ type: 'text', text: { content: article.citation } }],
        icon: { emoji: '📄' },
      },
    });
    
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          { type: 'text', text: { content: '🔗 ' } },
          { type: 'text', text: { content: 'Full-text available here', link: { url: article.fullTextUrl } } },
          { type: 'text', text: { content: ` (${article.fullTextUrl})` } },
        ],
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
    type: 'heading_3',
    heading_3: {
      rich_text: [{ type: 'text', text: { content: '📑 View All Articles in Database' } }],
    },
  });
  
  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{ type: 'text', text: { content: 'For detailed article information including summaries, strengths, weaknesses, and additional metadata, visit the Articles database:' } }],
    },
  });
  
  const articlesDbUrl = `https://www.notion.so/${articlesDatabaseId.replace(/-/g, '')}`;
  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        { type: 'text', text: { content: articlesDbUrl, link: { url: articlesDbUrl } } },
      ],
    },
  });
  
  return blocks;
}

async function replaceDatabaseSection(pageId, markdownSection, articlesDatabaseId) {
  try {
    // Get all blocks
    let allBlocks = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: startCursor,
        page_size: 100,
      });
      allBlocks = allBlocks.concat(response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    // Find the "Quick Access" section
    let quickAccessIndex = -1;
    for (let i = 0; i < allBlocks.length; i++) {
      if (allBlocks[i].type === 'heading_2' && 
          allBlocks[i].heading_2?.rich_text?.[0]?.plain_text?.includes('Quick Access')) {
        quickAccessIndex = i;
        break;
      }
    }

    if (quickAccessIndex === -1) {
      console.log('   ⚠️  Quick Access section not found, adding new one');
      // Add new section at the end
      const articles = parseArticles(markdownSection);
      const blocks = createCalloutBlocks(articles, articlesDatabaseId);
      
      // Add heading
      blocks.unshift({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📚 Quick Access: Citations & Full-Text Links' } }],
        },
      });
      
      blocks.unshift({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'All citations and direct links to full-text versions are listed below for easy access:' } }],
        },
      });
      
      await notion.blocks.children.append({ block_id: pageId, children: blocks });
      console.log(`   ✅ Added new database section`);
      return;
    }

    // Delete old section (from heading_2 to end or next heading_2/heading_1)
    const blocksToDelete = [];
    for (let i = quickAccessIndex; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      if (i > quickAccessIndex && 
          (block.type === 'heading_1' || 
           (block.type === 'heading_2' && !block.heading_2?.rich_text?.[0]?.plain_text?.includes('Quick Access')))) {
        break;
      }
      blocksToDelete.push(block.id);
    }

    // Delete old blocks
    for (const blockId of blocksToDelete) {
      try {
        await notion.blocks.delete({ block_id: blockId });
      } catch (error) {
        // Ignore
      }
    }

    // Add new callout-based section
    const articles = parseArticles(markdownSection);
    const newBlocks = createCalloutBlocks(articles, articlesDatabaseId);
    
    newBlocks.unshift({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '📚 Quick Access: Citations & Full-Text Links' } }],
      },
    });
    
    newBlocks.unshift({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: 'All citations and direct links to full-text versions are listed below for easy access:' } }],
      },
    });

    // Insert after the block before the deleted section
    const insertAfter = quickAccessIndex > 0 ? allBlocks[quickAccessIndex - 1].id : undefined;
    await notion.blocks.children.append({
      block_id: pageId,
      children: newBlocks,
      after: insertAfter,
    });

    console.log(`   ✅ Replaced database section with callout format`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function main() {
  const config = JSON.parse(readFileSync(join(repoRoot, '.notion-config.json'), 'utf8'));
  const articlesDatabaseId = config.academicDatabases.articles;
  
  const markdownPath = join(repoRoot, 'storage/bibliographies/attachment-theory-annotated-bibliographies.md');
  const markdownContent = readFileSync(markdownPath, 'utf8');
  
  const clinicalBibId = '2becd2a6-5422-8153-beed-ecb6a87892fd';
  const childFamilyBibId = '2becd2a6-5422-819e-b5ee-d0eb8d5cb95e';
  
  const clinicalSection = markdownContent.split('## Bibliography 1:')[1]?.split('## Bibliography 2:')[0] || '';
  const childFamilySection = markdownContent.split('## Bibliography 2:')[1]?.split('## Notes on Article Selection')[0] || '';
  
  console.log('Replacing database sections...\n');
  
  console.log('📚 Clinical Social Work Practice:');
  await replaceDatabaseSection(clinicalBibId, clinicalSection, articlesDatabaseId);
  
  console.log('\n📚 Child and Family Social Work:');
  await replaceDatabaseSection(childFamilyBibId, childFamilySection, articlesDatabaseId);
  
  console.log('\n✅ Complete!');
}

main();

