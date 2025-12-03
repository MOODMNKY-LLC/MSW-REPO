/**
 * Sync repository files to Notion database
 * 
 * This script scans the repository for files and creates/updates
 * corresponding entries in a Notion database.
 * 
 * Usage:
 *   node scripts/sync-files-to-notion.js [course-code]
 * 
 * Example:
 *   node scripts/sync-files-to-notion.js SOCW-6510
 */

import { config } from 'dotenv';
import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createNotionClient, getDataSourceId, queryDataSource, createPageInDataSource } from './notion-api-helper.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '../../..');

const notion = createNotionClient();

// Get database ID and data source ID from config file or environment variable
// Note: This is now async, so we'll initialize in main()
let DATABASE_ID;
let DATA_SOURCE_ID;

/**
 * Get file type based on extension
 */
function getFileType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const typeMap = {
    'pdf': 'Paper',
    'doc': 'Document',
    'docx': 'Document',
    'md': 'Note',
    'txt': 'Note',
    'pptx': 'Presentation',
    'xlsx': 'Spreadsheet',
  };
  return typeMap[ext] || 'Document';
}

/**
 * Extract course code from file path
 */
function extractCourseCode(filePath) {
  const match = filePath.match(/courses\/([A-Z0-9-]+)/);
  return match ? match[1] : null;
}

/**
 * Extract category from file path
 */
function extractCategory(filePath) {
  if (filePath.includes('/assignments/')) return 'Assignment';
  if (filePath.includes('/papers/')) return 'Paper';
  if (filePath.includes('/articles/')) return 'Article';
  if (filePath.includes('/notes/')) return 'Note';
  if (filePath.includes('/research/')) return 'Research';
  if (filePath.includes('/projects/')) return 'Project';
  return 'Document';
}

/**
 * Scan directory for files
 */
function scanDirectory(dir, courseFilter = null) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = readdirSync(currentDir);
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (stat.isFile()) {
        const relativePath = relative(repoRoot, fullPath);
        const courseCode = extractCourseCode(relativePath);
        
        if (!courseFilter || courseCode === courseFilter) {
          files.push({
            path: relativePath,
            name: entry,
            course: courseCode,
            type: getFileType(entry),
            category: extractCategory(relativePath),
          });
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Create or update Notion page for a file
 */
async function syncFileToNotion(file) {
  try {
    // Check if page already exists using data source query
    const response = await queryDataSource(DATA_SOURCE_ID, {
      filter: {
        property: 'File Path',
        rich_text: {
          equals: file.path,
        },
      },
    });

    const properties = {
      'Title': {
        title: [{ text: { content: file.name } }],
      },
      'File Path': {
        rich_text: [{ text: { content: file.path } }],
      },
      'Type': {
        select: { name: file.type },
      },
    };

    if (file.course) {
      properties['Course'] = {
        select: { name: file.course },
      };
    }

    if (file.category) {
      properties['Category'] = {
        select: { name: file.category },
      };
    }

    if (response.results.length > 0) {
      // Update existing page
      await notion.pages.update({
        page_id: response.results[0].id,
        properties,
      });
      console.log(`Updated: ${file.name}`);
    } else {
      // Create new page using data source parent
      await createPageInDataSource(DATA_SOURCE_ID, properties);
      console.log(`Created: ${file.name}`);
    }
  } catch (error) {
    console.error(`Error syncing ${file.name}:`, error.message);
  }
}

/**
 * Initialize database and data source IDs
 */
async function initializeIds() {
  DATABASE_ID = process.env.NOTION_DATABASE_ID;
  DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID;

  if (!DATABASE_ID || !DATA_SOURCE_ID) {
    try {
      const configPath = join(repoRoot, '.notion-config.json');
      const config = JSON.parse(readFileSync(configPath, 'utf8'));
      
      DATABASE_ID = DATABASE_ID || config.databaseId;
      
      // Get data source ID from config or fetch it
      if (config.dataSources && config.dataSources[DATABASE_ID]) {
        DATA_SOURCE_ID = config.dataSources[DATABASE_ID].id;
        console.log(`📋 Using data source ID from config: ${DATA_SOURCE_ID}`);
      } else if (DATABASE_ID) {
        console.log('🔄 Fetching data source ID from Notion API...');
        DATA_SOURCE_ID = await getDataSourceId(DATABASE_ID);
        console.log(`✅ Data source ID: ${DATA_SOURCE_ID}`);
      }
      
      if (!DATABASE_ID) {
        throw new Error('Database ID not found');
      }
    } catch (error) {
      console.error('❌ Could not read .notion-config.json or fetch data source ID.');
      console.error('   Please set NOTION_DATABASE_ID and NOTION_DATA_SOURCE_ID environment variables.');
      throw error;
    }
  }
}

/**
 * Main sync function
 */
async function main() {
  // Initialize IDs first
  await initializeIds();
  
  const courseFilter = process.argv[2] || null;
  const coursesDir = join(repoRoot, 'courses');
  
  console.log('Scanning repository for files...');
  const files = scanDirectory(coursesDir, courseFilter);
  
  console.log(`Found ${files.length} files to sync`);
  
  for (const file of files) {
    await syncFileToNotion(file);
    // Rate limiting - wait 350ms between requests (Notion API limit: 3 requests/second)
    await new Promise(resolve => setTimeout(resolve, 350));
  }
  
  console.log('Sync complete!');
}

main().catch(console.error);

