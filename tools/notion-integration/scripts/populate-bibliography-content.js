/**
 * Populate Bibliography Pages with Full Content
 * 
 * This script populates each bibliography page with the complete annotated bibliography
 * content and links the articles from the Articles database.
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
 * Parse markdown file to extract bibliography content
 */
function parseBibliographyContent(markdownContent) {
  const bibliographies = {
    clinical: null,
    childFamily: null,
  };

  // Split by bibliography sections
  const sections = markdownContent.split('## Bibliography');
  
  // Bibliography 1: Clinical Social Work Practice
  if (sections[1]) {
    const clinicalSection = sections[1];
    const articles = [];
    
    // Extract articles (5 articles)
    const articleMatches = clinicalSection.matchAll(/### Article \d+\n\*\*(.*?)\*\*\s*\((.*?)\)\.\s*(.*?)\.\s*\*(.*?)\*,\s*(\d+)\((\d+)\),\s*(\d+)-(\d+)\.\s*(https:\/\/.*?)\*\*\n\n([\s\S]*?)\n\n\*\*Full-text available at:\*\*\s*(https:\/\/.*?)\n/g);
    
    for (const match of articleMatches) {
      const citation = match[0];
      const fullText = match[11];
      const annotation = match[10].trim();
      
      articles.push({
        citation,
        annotation,
        fullTextUrl: fullText,
      });
    }
    
    bibliographies.clinical = {
      title: 'Attachment Theory in Clinical Social Work Practice',
      introduction: 'This annotated bibliography outlines research evidence about attachment theory in clinical social work practice. Each entry includes a peer-reviewed article citation in APA 7 format, followed by a brief paragraph summarizing the content, strengths, and weaknesses of the article.',
      articles,
    };
  }

  // Bibliography 2: Child and Family Social Work
  if (sections[2]) {
    const childFamilySection = sections[2];
    const articles = [];
    
    // Extract articles (5 articles)
    const articleMatches = childFamilySection.matchAll(/### Article \d+\n\*\*(.*?)\*\*\s*\((.*?)\)\.\s*(.*?)\.\s*\*(.*?)\*,\s*(\d+)\((\d+)\),\s*(\d+)-(\d+)\.\s*(https:\/\/.*?)\*\*\n\n([\s\S]*?)\n\n\*\*Full-text available at:\*\*\s*(https:\/\/.*?)\n/g);
    
    for (const match of articleMatches) {
      const citation = match[0];
      const fullText = match[11];
      const annotation = match[10].trim();
      
      articles.push({
        citation,
        annotation,
        fullTextUrl: fullText,
      });
    }
    
    bibliographies.childFamily = {
      title: 'Attachment Theory in Child and Family Social Work',
      introduction: 'This annotated bibliography outlines research evidence about attachment theory in child and family social work practice. Each entry includes a peer-reviewed article citation in APA 7 format, followed by a brief paragraph summarizing the content, strengths, and weaknesses of the article.',
      articles,
    };
  }

  return bibliographies;
}

/**
 * Convert markdown to Notion blocks
 */
function markdownToNotionBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  
  let currentParagraph = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) {
      if (currentParagraph.length > 0) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: currentParagraph.map(text => ({
              type: 'text',
              text: { content: text + ' ' },
            })),
          },
        });
        currentParagraph = [];
      }
      continue;
    }
    
    // Headings
    if (trimmed.startsWith('### ')) {
      if (currentParagraph.length > 0) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: currentParagraph.map(text => ({
              type: 'text',
              text: { content: text + ' ' },
            })),
          },
        });
        currentParagraph = [];
      }
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{
            type: 'text',
            text: { content: trimmed.replace('### ', '') },
          }],
        },
      });
    }
    // Bold text (citations)
    else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      if (currentParagraph.length > 0) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: currentParagraph.map(text => ({
              type: 'text',
              text: { content: text + ' ' },
            })),
          },
        });
        currentParagraph = [];
      }
      const citationText = trimmed.replace(/\*\*/g, '');
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: citationText },
            annotations: { bold: true },
          }],
        },
      });
    }
    // Regular text
    else {
      currentParagraph.push(trimmed);
    }
  }
  
  if (currentParagraph.length > 0) {
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: currentParagraph.map(text => ({
          type: 'text',
          text: { content: text + ' ' },
        })),
      },
    });
  }
  
  return blocks;
}

/**
 * Create bibliography content blocks
 */
function createBibliographyBlocks(bibliography) {
  const blocks = [];
  
  // Title
  blocks.push({
    object: 'block',
    type: 'heading_1',
    heading_1: {
      rich_text: [{
        type: 'text',
        text: { content: bibliography.title },
      }],
    },
  });
  
  // Introduction
  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{
        type: 'text',
        text: { content: bibliography.introduction },
      }],
    },
  });
  
  blocks.push({
    object: 'block',
    type: 'divider',
    divider: {},
  });
  
  // Articles
  bibliography.articles.forEach((article, index) => {
    blocks.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{
          type: 'text',
          text: { content: `Article ${index + 1}` },
        }],
      },
    });
    
    // Citation (bold)
    const citationLines = article.citation.split('\n').filter(l => l.trim());
    citationLines.forEach(line => {
      if (line.trim().startsWith('**')) {
        const citationText = line.replace(/\*\*/g, '').trim();
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: citationText },
              annotations: { bold: true },
            }],
          },
        });
      }
    });
    
    // Annotation
    const annotationBlocks = markdownToNotionBlocks(article.annotation);
    blocks.push(...annotationBlocks);
    
    // Full-text link
    if (article.fullTextUrl) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: 'Full-text available at: ' },
          }, {
            type: 'text',
            text: { content: article.fullTextUrl },
            annotations: { bold: true },
            href: article.fullTextUrl,
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
 * Find articles linked to bibliography
 */
async function findLinkedArticles(bibliographyId, articlesDatabaseId) {
  try {
    // Query articles database for articles linked to this bibliography
    const response = await notion.databases.query({
      database_id: articlesDatabaseId,
      filter: {
        property: 'Annotated Bibliographies',
        relation: {
          contains: bibliographyId,
        },
      },
    });
    
    return response.results;
  } catch (error) {
    console.warn(`Could not query articles: ${error.message}`);
    return [];
  }
}

/**
 * Populate bibliography page with content
 */
async function populateBibliographyPage(pageId, bibliography, articlesDatabaseId) {
  try {
    console.log(`\n📝 Populating: ${bibliography.title}`);
    
    // Get linked articles
    const linkedArticles = await findLinkedArticles(pageId, articlesDatabaseId);
    console.log(`   Found ${linkedArticles.length} linked articles`);
    
    // Create content blocks
    const blocks = createBibliographyBlocks(bibliography);
    
    // Add section for linked articles database
    if (linkedArticles.length > 0) {
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
            text: { content: 'The following articles are linked to this bibliography. Click on any article to view detailed information, summaries, strengths, and weaknesses.' },
          }],
        },
      });
      
      // Add linked database view
      blocks.push({
        object: 'block',
        type: 'child_database',
        child_database: {
          database_id: articlesDatabaseId,
          title: 'Articles',
        },
      });
    }
    
    // Replace page content
    await notion.blocks.children.append({
      block_id: pageId,
      children: blocks,
    });
    
    console.log(`   ✅ Content added successfully`);
    
  } catch (error) {
    console.error(`   ❌ Error populating page: ${error.message}`);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config = getConfig();
    const bibliographiesDatabaseId = config.academicDatabases.bibliographies;
    const articlesDatabaseId = config.academicDatabases.articles;
    
    // Read markdown file
    const markdownPath = join(repoRoot, 'storage/bibliographies/attachment-theory-annotated-bibliographies.md');
    const markdownContent = readFileSync(markdownPath, 'utf8');
    
    // Parse bibliographies
    const bibliographies = parseBibliographyContent(markdownContent);
    
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     Populate Bibliography Pages with Content               ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    // Find bibliography pages
    const clinicalBibId = '2becd2a6-5422-8153-beed-ecb6a87892fd';
    const childFamilyBibId = '2becd2a6-5422-819e-b5ee-d0eb8d5cb95e';
    
    // Populate Clinical Social Work Practice bibliography
    if (bibliographies.clinical) {
      await populateBibliographyPage(clinicalBibId, bibliographies.clinical, articlesDatabaseId);
    }
    
    // Populate Child and Family Social Work bibliography
    if (bibliographies.childFamily) {
      await populateBibliographyPage(childFamilyBibId, bibliographies.childFamily, articlesDatabaseId);
    }
    
    console.log('\n✅ All bibliography pages populated successfully!');
    console.log(`\n🔗 View bibliographies:`);
    console.log(`   Clinical: https://www.notion.so/${clinicalBibId.replace(/-/g, '')}`);
    console.log(`   Child & Family: https://www.notion.so/${childFamilyBibId.replace(/-/g, '')}\n`);
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();

