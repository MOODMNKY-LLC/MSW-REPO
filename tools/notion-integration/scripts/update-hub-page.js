/**
 * Update HUB Page in Notion
 * 
 * This script finds the HUB page and updates it with hero content
 * and landing page aesthetics for the MSW-REPO integration.
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

const notion = new Client({
  auth: NOTION_API_KEY,
});

/**
 * Hero content blocks for the HUB page
 */
const heroContent = [
  {
    object: 'block',
    type: 'heading_1',
    heading_1: {
      rich_text: [
        {
          type: 'text',
          text: { content: '🎓 MSW-REPO Hub' },
          annotations: {
            bold: true,
            color: 'default',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'Welcome to your personalized graduate student hub. This is your central command center for managing coursework, research, assignments, and academic projects.',
          },
          annotations: {
            color: 'default',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'divider',
    divider: {},
  },
  {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [
        {
          type: 'text',
          text: { content: '🚀 Quick Access' },
          annotations: {
            bold: true,
            color: 'blue',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'Navigate to your most important resources and tools:',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: '📚 Academic Files Database - Manage all your files, documents, papers, and assignments',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: '📝 Course Workspaces - Organized by course code (SOCW-6510, etc.)',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: '🔧 Integration Tools - Sync files, automate workflows, and manage metadata',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'divider',
    divider: {},
  },
  {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [
        {
          type: 'text',
          text: { content: '✨ Features' },
          annotations: {
            bold: true,
            color: 'purple',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'column_list',
    column_list: {
      children: [
        {
          object: 'block',
          type: 'column',
          column: {
            children: [
              {
                object: 'block',
                type: 'heading_3',
                heading_3: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: '📁 File Management' },
                    },
                  ],
                },
              },
              {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: 'Store and organize all your academic files with automatic metadata tracking and version control.',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'column',
          column: {
            children: [
              {
                object: 'block',
                type: 'heading_3',
                heading_3: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: '🔄 Sync & Automation' },
                    },
                  ],
                },
              },
              {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: 'Bidirectional sync between Notion and your repository. Automated workflows for seamless organization.',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'column',
          column: {
            children: [
              {
                object: 'block',
                type: 'heading_3',
                heading_3: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: '🎯 Course Organization' },
                    },
                  ],
                },
              },
              {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: 'Separate workspaces for each course with organized folders for assignments, notes, research, and projects.',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'divider',
    divider: {},
  },
  {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [
        {
          type: 'text',
          text: { content: '🔗 Integration Details' },
          annotations: {
            bold: true,
            color: 'green',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'This workspace is powered by the SCHOLAR MNKY integration, connecting your MSW-REPO repository with Notion for seamless academic workflow management.',
          },
        },
      ],
      icon: {
        emoji: '🤖',
      },
      color: 'blue_background',
    },
  },
  {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: '• ',
          },
        },
        {
          type: 'text',
          text: {
            content: 'Integration',
          },
          annotations: {
            bold: true,
          },
        },
        {
          type: 'text',
          text: {
            content: ': SCHOLAR MNKY',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: '• ',
          },
        },
        {
          type: 'text',
          text: {
            content: 'Teamspace',
          },
          annotations: {
            bold: true,
          },
        },
        {
          type: 'text',
          text: {
            content: ': MSW H.Q. Teamspace',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: '• ',
          },
        },
        {
          type: 'text',
          text: {
            content: 'Repository',
          },
          annotations: {
            bold: true,
          },
        },
        {
          type: 'text',
          text: {
            content: ': MSW-REPO (GitHub)',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'divider',
    divider: {},
  },
  {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [
        {
          type: 'text',
          text: { content: '📖 Getting Started' },
          annotations: {
            bold: true,
            color: 'orange',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'toggle',
    toggle: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'How to sync files from repository' },
          annotations: {
            bold: true,
          },
        },
      ],
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Use the sync script to automatically create database entries for files in your repository:',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'code',
          code: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'cd tools/notion-integration\npnpm run sync [course-code]',
                },
              },
            ],
            language: 'bash',
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'toggle',
    toggle: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'How to add a new course' },
          annotations: {
            bold: true,
          },
        },
      ],
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '1. Create course directory in repository\n2. Add course option to database Course property\n3. Sync files using the sync script',
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'toggle',
    toggle: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'How to use Cursor MCP integration' },
          annotations: {
            bold: true,
          },
        },
      ],
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Use Cursor chat to interact with your database:\n\n"Query the MSW-REPO Academic Files database for all assignments"\n\n"Create a new entry in the database..."',
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    object: 'block',
    type: 'divider',
    divider: {},
  },
  {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: '💡 ',
          },
        },
        {
          type: 'text',
          text: {
            content: 'Tip',
          },
          annotations: {
            bold: true,
            italic: true,
          },
        },
        {
          type: 'text',
          text: {
            content: ': This hub is your starting point. Explore the pages linked below to dive deeper into specific areas of your academic work.',
          },
        },
      ],
    },
  },
];

/**
 * Find the HUB page
 */
async function findHubPage() {
  try {
    console.log('Searching for HUB page...\n');
    
    const searchResponse = await notion.search({
      query: 'HUB',
      filter: {
        property: 'object',
        value: 'page',
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
    });

    if (searchResponse.results.length === 0) {
      throw new Error('HUB page not found. Please create a page named "HUB" first.');
    }

    // Find exact match for "HUB" (case-insensitive)
    const hubPage = searchResponse.results.find(
      (page) => page.properties?.title?.title?.[0]?.plain_text?.toUpperCase() === 'HUB'
    ) || searchResponse.results[0];

    const pageTitle = hubPage.properties?.title?.title?.[0]?.plain_text || 'Untitled';
    console.log(`✅ Found page: "${pageTitle}"`);
    console.log(`📋 Page ID: ${hubPage.id}\n`);

    return hubPage;
  } catch (error) {
    console.error('❌ Error finding HUB page:', error.message);
    throw error;
  }
}

/**
 * Clear existing content and add hero content
 */
async function updateHubPage(pageId) {
  try {
    console.log('Updating HUB page with hero content...\n');

    // First, get existing blocks to clear them
    const existingBlocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    // Delete existing blocks (in reverse order to avoid index issues)
    if (existingBlocks.results.length > 0) {
      console.log(`Removing ${existingBlocks.results.length} existing blocks...`);
      for (const block of existingBlocks.results.reverse()) {
        try {
          await notion.blocks.delete({
            block_id: block.id,
          });
        } catch (error) {
          // Some blocks can't be deleted, skip them
          if (!error.message.includes('Cannot delete')) {
            console.warn(`Warning: Could not delete block ${block.id}`);
          }
        }
      }
    }

    // Add hero content
    console.log('Adding hero content...\n');
    
    // Notion API requires adding blocks one at a time or in batches
    // We'll add them in batches of 100 (API limit)
    const batchSize = 100;
    for (let i = 0; i < heroContent.length; i += batchSize) {
      const batch = heroContent.slice(i, i + batchSize);
      
      await notion.blocks.children.append({
        block_id: pageId,
        children: batch,
      });
      
      console.log(`Added batch ${Math.floor(i / batchSize) + 1} (${batch.length} blocks)`);
    }

    console.log('\n✅ HUB page updated successfully!');
    console.log(`🔗 View your page: https://www.notion.so/${pageId.replace(/-/g, '')}`);
    
  } catch (error) {
    console.error('❌ Error updating HUB page:', error.message);
    if (error.code === 'validation_error') {
      console.error('\n💡 Tip: Some block types may need adjustment. Check the error details above.');
    }
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const hubPage = await findHubPage();
    await updateHubPage(hubPage.id);
    
    console.log('\n✨ HUB page is now your beautiful landing page!');
    console.log('🎨 The page includes hero content, features, and getting started guides.');
    
  } catch (error) {
    console.error('\n❌ Failed to update HUB page:', error.message);
    process.exit(1);
  }
}

main();

