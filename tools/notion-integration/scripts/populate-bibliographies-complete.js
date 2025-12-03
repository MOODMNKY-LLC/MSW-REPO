/**
 * Populate Bibliography Pages with Complete Annotated Bibliography Content
 * 
 * This script replaces the content of each bibliography page with the complete
 * annotated bibliography including all article citations and annotations.
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
 * Clear existing page content
 */
async function clearPageContent(pageId) {
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

    // Archive all blocks
    for (const block of allBlocks) {
      try {
        await notion.blocks.delete({
          block_id: block.id,
        });
      } catch (error) {
        // Ignore errors for blocks that can't be deleted
      }
    }
  } catch (error) {
    console.warn(`Could not clear page content: ${error.message}`);
  }
}

/**
 * Parse markdown and create Notion blocks for bibliography
 */
function parseBibliographyToBlocks(markdownSection) {
  const blocks = [];
  
  // Introduction
  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{
        type: 'text',
        text: { content: 'This annotated bibliography outlines research evidence about attachment theory in social work practice. Each entry includes a peer-reviewed article citation in APA 7 format, followed by a brief paragraph (3-4 sentences) summarizing the content, strengths, and weaknesses of the article.' },
      }],
    },
  });
  
  blocks.push({
    object: 'block',
    type: 'divider',
    divider: {},
  });
  
  // Parse articles - split by "### Article"
  const articleParts = markdownSection.split(/### Article \d+/).slice(1);
  
  articleParts.forEach((articlePart, index) => {
    const articleNum = index + 1;
    
    // Article heading
    blocks.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{
          type: 'text',
          text: { content: `Article ${articleNum}` },
        }],
      },
    });
    
    // Extract citation (between ** markers)
    const citationMatch = articlePart.match(/\*\*(.*?)\*\*/);
    if (citationMatch) {
      const citation = citationMatch[1].trim();
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: citation },
            annotations: { bold: true },
          }],
        },
      });
    }
    
    // Extract annotation (text between citation line and "Full-text available at")
    // The citation is on one line, then blank line, then annotation, then blank line, then "Full-text"
    const lines = articlePart.split('\n');
    let annotationStart = -1;
    let annotationEnd = -1;
    
    // Find where annotation starts (after citation line with **)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('**') && lines[i].trim().endsWith('**')) {
        // Citation line found, annotation starts after next blank line
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim() === '' && j + 1 < lines.length) {
            annotationStart = j + 1;
            break;
          }
        }
        break;
      }
    }
    
    // Find where annotation ends (before "Full-text available at")
    for (let i = annotationStart; i < lines.length; i++) {
      if (lines[i].trim().startsWith('**Full-text available at:**')) {
        annotationEnd = i;
        break;
      }
    }
    
    // Extract annotation text
    if (annotationStart >= 0 && annotationEnd >= 0) {
      const annotationLines = lines.slice(annotationStart, annotationEnd).filter(l => l.trim());
      const annotationText = annotationLines.join(' ').trim();
      
      if (annotationText) {
        // Split into sentences for better formatting
        const sentences = annotationText.match(/[^.!?]+[.!?]+/g) || [annotationText];
        sentences.forEach(sentence => {
          const trimmed = sentence.trim();
          if (trimmed) {
            blocks.push({
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [{
                  type: 'text',
                  text: { content: trimmed + ' ' },
                }],
              },
            });
          }
        });
      }
    }
    
    // Extract full-text URL
    const urlMatch = articlePart.match(/\*\*Full-text available at:\*\*\s*(https:\/\/[^\s\n]+)/);
    if (urlMatch) {
      const fullTextUrl = urlMatch[1].trim();
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: 'Full-text available at: ' },
          }, {
            type: 'text',
            text: { content: fullTextUrl },
            annotations: { bold: true },
            href: fullTextUrl,
          }],
        },
      });
    }
    
    blocks.push({
      object: 'block',
      type: 'divider',
      divider: {},
    });
  });
  
  return blocks;
}

/**
 * Populate bibliography page
 */
async function populateBibliographyPage(pageId, markdownSection, articlesDatabaseId) {
  try {
    console.log(`\n📝 Populating bibliography page...`);
    
    // Clear existing content
    console.log('   Clearing existing content...');
    await clearPageContent(pageId);
    
    // Create new content blocks
    const blocks = parseBibliographyToBlocks(markdownSection);
    
    // Add section for linked articles
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{
          type: 'text',
          text: { content: '📑 Linked Articles' },
        }],
      },
    });
    
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: { content: 'The articles referenced in this bibliography are stored in the Articles database. Each article entry contains detailed information including summaries, strengths, weaknesses, and full-text access links. Use the Articles database to view and manage all article details.' },
        }],
      },
    });
    
    // Add link to Articles database
    const articlesDbUrl = `https://www.notion.so/${articlesDatabaseId.replace(/-/g, '')}`;
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: { content: 'View Articles Database: ' },
        }, {
          type: 'text',
          text: { content: articlesDbUrl },
          annotations: { bold: true },
          href: articlesDbUrl,
        }],
      },
    });
    
    // Append all blocks
    await notion.blocks.children.append({
      block_id: pageId,
      children: blocks,
    });
    
    console.log(`   ✅ Added ${blocks.length} content blocks`);
    
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
    console.log('║     Populate Bibliography Pages - Complete Content         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    // Bibliography page IDs
    const clinicalBibId = '2becd2a6-5422-8153-beed-ecb6a87892fd';
    const childFamilyBibId = '2becd2a6-5422-819e-b5ee-d0eb8d5cb95e';
    
    // Extract sections
    const clinicalSection = markdownContent.split('## Bibliography 1:')[1]?.split('## Bibliography 2:')[0] || '';
    const childFamilySection = markdownContent.split('## Bibliography 2:')[1]?.split('## Notes on Article Selection')[0] || '';
    
    // Populate Clinical Social Work Practice bibliography
    if (clinicalSection) {
      console.log('📚 Processing: Attachment Theory in Clinical Social Work Practice');
      await populateBibliographyPage(clinicalBibId, clinicalSection, articlesDatabaseId);
    }
    
    // Populate Child and Family Social Work bibliography
    if (childFamilySection) {
      console.log('\n📚 Processing: Attachment Theory in Child and Family Social Work');
      await populateBibliographyPage(childFamilyBibId, childFamilySection, articlesDatabaseId);
    }
    
    console.log('\n✅ All bibliography pages populated successfully!');
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

