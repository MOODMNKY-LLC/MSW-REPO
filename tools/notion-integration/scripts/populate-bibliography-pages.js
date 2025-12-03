/**
 * Populate Bibliography Pages with Full Annotated Bibliography Content
 * 
 * This script populates each bibliography page with the complete annotated bibliography
 * content from the markdown file, properly formatted for Notion.
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
 * Parse markdown and create Notion-formatted content
 */
function createBibliographyContent(markdownContent, bibliographyTitle) {
  const blocks = [];
  
  // Main title
  blocks.push({
    object: 'block',
    type: 'heading_1',
    heading_1: {
      rich_text: [{
        type: 'text',
        text: { content: bibliographyTitle },
      }],
    },
  });
  
  // Introduction paragraph
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
  
  // Parse articles from markdown
  // Format: ### Article N\n**Citation**\n\nAnnotation text\n\n**Full-text available at:** URL\n---
  const articleSections = markdownContent.split(/### Article \d+/).slice(1); // Skip first empty section
  
  articleSections.forEach((section, index) => {
    const articleNum = index + 1;
    
    // Extract citation (between ** markers on first line after ### Article)
    const citationMatch = section.match(/\*\*(.*?)\*\*/);
    if (!citationMatch) return;
    
    const citation = citationMatch[1].trim();
    
    // Extract annotation (between citation and "Full-text available at")
    const annotationMatch = section.match(/\*\*.*?\*\*\n\n([\s\S]*?)\n\n\*\*Full-text available at:\*\*/);
    const annotation = annotationMatch ? annotationMatch[1].trim() : '';
    
    // Extract full-text URL
    const urlMatch = section.match(/\*\*Full-text available at:\*\*\s*(https:\/\/[^\s\n]+)/);
    const fullTextUrl = urlMatch ? urlMatch[1].trim() : '';
    
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
    
    // Citation (bold)
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
    
    // Annotation paragraph(s) - split by sentences or paragraphs
    if (annotation) {
      const annotationParagraphs = annotation.split(/\n\n+/).filter(p => p.trim());
      annotationParagraphs.forEach(para => {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: para.trim() },
            }],
          },
        });
      });
    }
    
    // Full-text link
    if (fullTextUrl) {
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
 * Populate a bibliography page
 */
async function populatePage(pageId, markdownContent, bibliographyTitle, articlesDatabaseId) {
  try {
    console.log(`\n📝 Populating: ${bibliographyTitle}`);
    
    // Create content blocks
    const blocks = createBibliographyContent(markdownContent, bibliographyTitle);
    
    // Add section for linked articles
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{
          type: 'text',
          text: { content: '📑 Linked Articles Database' },
        }],
      },
    });
    
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: { content: 'The articles referenced in this bibliography are linked below. Each article entry contains detailed information including summaries, strengths, weaknesses, and full-text access links.' },
        }],
      },
    });
    
    // Add linked database view (if supported)
    // Note: child_database blocks can't be created via API, so we'll add a link instead
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: { content: 'View all articles in the Articles database, filtered by this bibliography.' },
        }],
      },
    });
    
    // Append blocks to page
    await notion.blocks.children.append({
      block_id: pageId,
      children: blocks,
    });
    
    console.log(`   ✅ Content added successfully (${blocks.length} blocks)`);
    
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
    console.log('║     Populate Bibliography Pages with Content               ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    // Bibliography page IDs
    const clinicalBibId = '2becd2a6-5422-8153-beed-ecb6a87892fd';
    const childFamilyBibId = '2becd2a6-5422-819e-b5ee-d0eb8d5cb95e';
    
    // Extract content for each bibliography
    const clinicalSection = markdownContent.split('## Bibliography 1:')[1]?.split('## Bibliography 2:')[0] || '';
    const childFamilySection = markdownContent.split('## Bibliography 2:')[1] || '';
    
    // Populate Clinical Social Work Practice bibliography
    if (clinicalSection) {
      await populatePage(
        clinicalBibId,
        clinicalSection,
        'Attachment Theory in Clinical Social Work Practice',
        articlesDatabaseId
      );
    }
    
    // Populate Child and Family Social Work bibliography
    if (childFamilySection) {
      await populatePage(
        childFamilyBibId,
        childFamilySection,
        'Attachment Theory in Child and Family Social Work',
        articlesDatabaseId
      );
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

