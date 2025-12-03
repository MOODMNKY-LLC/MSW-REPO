/**
 * Update HUB Page with Academic Management Section
 * 
 * Adds a new section to the HUB page with links to all academic databases
 * and overview information.
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
 * Get HUB page ID from config
 */
function getHubPageId() {
  try {
    const configPath = join(repoRoot, '.notion-config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    return config.hubPageId;
  } catch (error) {
    console.error('Could not read hubPageId from config');
    return null;
  }
}

/**
 * Get database IDs from config
 */
function getDatabaseIds() {
  try {
    const configPath = join(repoRoot, '.notion-config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    return config.academicDatabases || {};
  } catch (error) {
    return {};
  }
}

/**
 * Create academic management section content
 */
function createAcademicSection(databaseIds) {
  const {
    assignments,
    treatmentPlans,
    sessionNotes,
    bibliographies,
    articles,
    rubrics,
    textbooks,
  } = databaseIds;

  return [
    {
      object: 'block',
      type: 'divider',
      divider: {},
    },
    {
      object: 'block',
      type: 'heading_1',
      heading_1: {
        rich_text: [
          {
            type: 'text',
            text: { content: '📚 Academic Management' },
            annotations: {
              bold: true,
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
              content: 'Manage assignments, treatment plans, session notes, bibliographies, and academic resources all in one place.',
            },
          },
        ],
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: { content: '🗂️ Databases' },
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
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: '📋 ' },
          },
          {
            type: 'text',
            text: {
              content: 'Assignments',
            },
            annotations: {
              bold: true,
            },
          },
          {
            type: 'text',
            text: {
              content: ' - Track all coursework, due dates, and completion status',
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
            text: { content: '📝 ' },
          },
          {
            type: 'text',
            text: {
              content: 'Treatment Plans',
            },
            annotations: {
              bold: true,
            },
          },
          {
            type: 'text',
            text: {
              content: ' - Case study-based treatment plans (CBT, BA, ST, etc.)',
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
            text: { content: '📄 ' },
          },
          {
            type: 'text',
            text: {
              content: 'Session Notes',
            },
            annotations: {
              bold: true,
            },
          },
          {
            type: 'text',
            text: {
              content: ' - SOAP format notes based on case studies',
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
            text: { content: '📚 ' },
          },
          {
            type: 'text',
            text: {
              content: 'Annotated Bibliographies',
            },
            annotations: {
              bold: true,
            },
          },
          {
            type: 'text',
            text: {
              content: ' - Research articles and annotations for papers',
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
            text: { content: '📑 ' },
          },
          {
            type: 'text',
            text: {
              content: 'Articles',
            },
            annotations: {
              bold: true,
            },
          },
          {
            type: 'text',
            text: {
              content: ' - Individual research articles with summaries and analysis',
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
            text: { content: '📊 ' },
          },
          {
            type: 'text',
            text: {
              content: 'Rubrics & Guides',
            },
            annotations: {
              bold: true,
            },
          },
          {
            type: 'text',
            text: {
              content: ' - Assignment rubrics, templates, and guides',
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
            text: { content: '📖 ' },
          },
          {
            type: 'text',
            text: {
              content: 'Textbooks & Resources',
            },
            annotations: {
              bold: true,
            },
          },
          {
            type: 'text',
            text: {
              content: ' - Ebooks, PDFs, and programmatically accessible resources',
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
            text: { content: '💡 Quick Start' },
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
      type: 'toggle',
      toggle: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'How to create a Treatment Plan' },
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
                    content: '1. Open the Treatment Plans database\n2. Click "New" to create a new entry\n3. Fill in Client Name, Case Study Source (e.g., "Barlow p. 287"), and Treatment Modality\n4. Link to the related Assignment\n5. Upload your treatment plan file',
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
            text: { content: 'How to create a Session Note' },
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
                    content: '1. Open the Session Notes database\n2. Create a new entry\n3. Fill in Client Name, Date, and Case Study Source\n4. Complete SOAP sections (S, O, A, P)\n5. Link to related Treatment Plan and Assignment\n6. Upload the session note file',
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
            text: { content: 'How to manage Annotated Bibliographies' },
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
                    content: '1. Create a new entry in Annotated Bibliographies database\n2. Set Topic (e.g., "Attachment Theory")\n3. Add Articles by creating entries in Articles database and linking them\n4. Each Article entry includes Title, Authors, Summary, Strengths, Weaknesses\n5. The Articles Count rollup automatically tracks how many articles you have',
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
      type: 'callout',
      callout: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: '💾 File Storage: All files are stored in the repository under storage/ directories and synced to Notion. Use the sync scripts to keep everything organized.',
            },
          },
        ],
        icon: {
          emoji: '💾',
        },
        color: 'blue_background',
      },
    },
  ];
}

/**
 * Main function
 */
async function main() {
  try {
    const hubPageId = getHubPageId();
    if (!hubPageId) {
      throw new Error('HUB page ID not found in config');
    }

    const databaseIds = getDatabaseIds();
    if (Object.keys(databaseIds).length === 0) {
      throw new Error('Academic database IDs not found in config');
    }

    console.log('Adding Academic Management section to HUB page...\n');

    const content = createAcademicSection(databaseIds);

    // Append content to HUB page
    await notion.blocks.children.append({
      block_id: hubPageId,
      children: content,
    });

    console.log('✅ Academic Management section added to HUB page!');
    console.log(`🔗 View your HUB: https://www.notion.so/${hubPageId.replace(/-/g, '')}`);

  } catch (error) {
    console.error('❌ Error updating HUB page:', error.message);
    process.exit(1);
  }
}

main();

