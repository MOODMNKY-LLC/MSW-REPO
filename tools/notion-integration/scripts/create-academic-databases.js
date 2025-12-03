/**
 * Create Academic Management Databases in Notion
 * 
 * This script creates all databases needed for academic assignment management:
 * - Assignments
 * - Treatment Plans
 * - Session Notes
 * - Annotated Bibliographies
 * - Articles
 * - Rubrics & Guides
 * - Textbooks & Resources
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
 * Create Assignments Database
 */
async function createAssignmentsDatabase(parentPageId) {
  console.log('Creating Assignments database...');
  
  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId,
    },
    title: [
      {
        type: 'text',
        text: { content: 'Assignments' },
      },
    ],
    properties: {
      'Title': {
        title: {},
      },
      'Course': {
        select: {
          options: [
            { name: 'SOCW-6510', color: 'blue' },
            { name: 'SOCW-6520', color: 'green' },
            { name: 'SOCW-6530', color: 'yellow' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      'Type': {
        select: {
          options: [
            { name: 'Treatment Plan', color: 'blue' },
            { name: 'Session Note', color: 'green' },
            { name: 'Annotated Bibliography', color: 'yellow' },
            { name: 'Research Paper', color: 'purple' },
            { name: 'Presentation', color: 'orange' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      'Status': {
        select: {
          options: [
            { name: 'Not Started', color: 'gray' },
            { name: 'In Progress', color: 'yellow' },
            { name: 'Completed', color: 'green' },
            { name: 'Submitted', color: 'blue' },
            { name: 'Graded', color: 'default' },
          ],
        },
      },
      'Due Date': {
        date: {},
      },
      // Relations will be added after all databases are created
      'Files': {
        files: {},
      },
      'Notes': {
        rich_text: {},
      },
      'Created': {
        created_time: {},
      },
      'Updated': {
        last_edited_time: {},
      },
    },
  });

  console.log(`✅ Created Assignments database: ${database.id}`);
  return database.id;
}

/**
 * Create Treatment Plans Database
 */
async function createTreatmentPlansDatabase(parentPageId) {
  console.log('Creating Treatment Plans database...');
  
  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId,
    },
    title: [
      {
        type: 'text',
        text: { content: 'Treatment Plans' },
      },
    ],
    properties: {
      'Client Name': {
        title: {},
      },
      'Case Study Source': {
        rich_text: {},
      },
      'Treatment Modality': {
        select: {
          options: [
            { name: 'CBT', color: 'blue' },
            { name: 'BA', color: 'green' },
            { name: 'ST', color: 'yellow' },
            { name: 'DBT', color: 'purple' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      'Status': {
        select: {
          options: [
            { name: 'Draft', color: 'gray' },
            { name: 'In Progress', color: 'yellow' },
            { name: 'Completed', color: 'green' },
            { name: 'Submitted', color: 'blue' },
          ],
        },
      },
      // Relations will be added after all databases are created
      'File': {
        files: {},
      },
      'Notes': {
        rich_text: {},
      },
      'Created': {
        created_time: {},
      },
    },
  });

  console.log(`✅ Created Treatment Plans database: ${database.id}`);
  return database.id;
}

/**
 * Create Session Notes Database
 */
async function createSessionNotesDatabase(parentPageId) {
  console.log('Creating Session Notes database...');
  
  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId,
    },
    title: [
      {
        type: 'text',
        text: { content: 'Session Notes' },
      },
    ],
    properties: {
      'Client Name': {
        title: {},
      },
      'Date': {
        date: {},
      },
      'Case Study Source': {
        rich_text: {},
      },
      'SOAP S': {
        rich_text: {},
      },
      'SOAP O': {
        rich_text: {},
      },
      'SOAP A': {
        rich_text: {},
      },
      'SOAP P': {
        rich_text: {},
      },
      // Relations will be added after all databases are created
      'File': {
        files: {},
      },
      'Created': {
        created_time: {},
      },
    },
  });

  console.log(`✅ Created Session Notes database: ${database.id}`);
  return database.id;
}

/**
 * Create Annotated Bibliographies Database
 */
async function createBibliographiesDatabase(parentPageId) {
  console.log('Creating Annotated Bibliographies database...');
  
  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId,
    },
    title: [
      {
        type: 'text',
        text: { content: 'Annotated Bibliographies' },
      },
    ],
    properties: {
      'Topic': {
        title: {},
      },
      'Course': {
        select: {
          options: [
            { name: 'SOCW-6510', color: 'blue' },
            { name: 'SOCW-6520', color: 'green' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      'Status': {
        select: {
          options: [
            { name: 'Researching', color: 'yellow' },
            { name: 'Writing', color: 'orange' },
            { name: 'Completed', color: 'green' },
            { name: 'Submitted', color: 'blue' },
          ],
        },
      },
      'Due Date': {
        date: {},
      },
      // Relations and rollups will be added after all databases are created
      'File': {
        files: {},
      },
      'Created': {
        created_time: {},
      },
    },
  });

  console.log(`✅ Created Annotated Bibliographies database: ${database.id}`);
  return database.id;
}

/**
 * Create Articles Database
 */
async function createArticlesDatabase(parentPageId) {
  console.log('Creating Articles database...');
  
  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId,
    },
    title: [
      {
        type: 'text',
        text: { content: 'Articles' },
      },
    ],
    properties: {
      'Title': {
        title: {},
      },
      'Authors': {
        rich_text: {},
      },
      'Year': {
        number: {},
      },
      'Journal': {
        rich_text: {},
      },
      'DOI/URL': {
        url: {},
      },
      'Summary': {
        rich_text: {},
      },
      'Strengths': {
        rich_text: {},
      },
      'Weaknesses': {
        rich_text: {},
      },
      // Relations will be added after all databases are created
      'Created': {
        created_time: {},
      },
    },
  });

  console.log(`✅ Created Articles database: ${database.id}`);
  return database.id;
}

/**
 * Create Rubrics & Guides Database
 */
async function createRubricsDatabase(parentPageId) {
  console.log('Creating Rubrics & Guides database...');
  
  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId,
    },
    title: [
      {
        type: 'text',
        text: { content: 'Rubrics & Guides' },
      },
    ],
    properties: {
      'Title': {
        title: {},
      },
      'Type': {
        select: {
          options: [
            { name: 'Rubric', color: 'blue' },
            { name: 'Guide', color: 'green' },
            { name: 'Template', color: 'yellow' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      'Course': {
        select: {
          options: [
            { name: 'SOCW-6510', color: 'blue' },
            { name: 'SOCW-6520', color: 'green' },
            { name: 'All Courses', color: 'default' },
          ],
        },
      },
      'Assignment Type': {
        select: {
          options: [
            { name: 'Treatment Plan', color: 'blue' },
            { name: 'Session Note', color: 'green' },
            { name: 'Bibliography', color: 'yellow' },
            { name: 'Research Paper', color: 'purple' },
            { name: 'All Types', color: 'default' },
          ],
        },
      },
      'File': {
        files: {},
      },
      'Description': {
        rich_text: {},
      },
      'Created': {
        created_time: {},
      },
    },
  });

  console.log(`✅ Created Rubrics & Guides database: ${database.id}`);
  return database.id;
}

/**
 * Create Textbooks & Resources Database
 */
async function createTextbooksDatabase(parentPageId) {
  console.log('Creating Textbooks & Resources database...');
  
  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId,
    },
    title: [
      {
        type: 'text',
        text: { content: 'Textbooks & Resources' },
      },
    ],
    properties: {
      'Title': {
        title: {},
      },
      'Author': {
        rich_text: {},
      },
      'Type': {
        select: {
          options: [
            { name: 'Textbook', color: 'blue' },
            { name: 'Article', color: 'green' },
            { name: 'Guide', color: 'yellow' },
            { name: 'Handbook', color: 'purple' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      'File Path': {
        rich_text: {},
      },
      'Course Relevance': {
        multi_select: {
          options: [
            { name: 'SOCW-6510', color: 'blue' },
            { name: 'SOCW-6520', color: 'green' },
            { name: 'All Courses', color: 'default' },
          ],
        },
      },
      'Programmatic Access': {
        rich_text: {},
      },
      'File': {
        files: {},
      },
      'Created': {
        created_time: {},
      },
    },
  });

  console.log(`✅ Created Textbooks & Resources database: ${database.id}`);
  return database.id;
}

/**
 * Update database relationships
 */
async function updateRelationships(databaseIds) {
  console.log('\nUpdating database relationships...');
  
  const {
    assignments,
    treatmentPlans,
    sessionNotes,
    bibliographies,
    articles,
    rubrics,
  } = databaseIds;

  // Update Assignments database
  await notion.databases.update({
    database_id: assignments,
    properties: {
      'Rubric': {
        relation: {
          database_id: rubrics,
          single_property: {},
        },
      },
      'Related Treatment Plan': {
        relation: {
          database_id: treatmentPlans,
          single_property: {},
        },
      },
      'Related Session Notes': {
        relation: {
          database_id: sessionNotes,
          single_property: {},
        },
      },
      'Related Bibliography': {
        relation: {
          database_id: bibliographies,
          single_property: {},
        },
      },
    },
  });

  // Update Treatment Plans database - add Assignment relation
  await notion.databases.update({
    database_id: treatmentPlans,
    properties: {
      'Assignment': {
        relation: {
          database_id: assignments,
          single_property: {},
        },
      },
    },
  });

  // Update Session Notes database
  await notion.databases.update({
    database_id: sessionNotes,
    properties: {
      'Treatment Plan': {
        relation: {
          database_id: treatmentPlans,
          single_property: {},
        },
      },
      'Assignment': {
        relation: {
          database_id: assignments,
          single_property: {},
        },
      },
    },
  });

  // Update Bibliographies database
  await notion.databases.update({
    database_id: bibliographies,
    properties: {
      'Assignment': {
        relation: {
          database_id: assignments,
        },
      },
      'Articles': {
        relation: {
          database_id: articles,
        },
      },
    },
  });

  // Update Articles database
  await notion.databases.update({
    database_id: articles,
    properties: {
      'Bibliography': {
        relation: {
          database_id: bibliographies,
          single_property: {},
        },
      },
    },
  });

  console.log('✅ Updated all database relationships');
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

    console.log(`\n📋 Creating academic databases under HUB page: ${hubPageId}\n`);

    // Create all databases
    const assignments = await createAssignmentsDatabase(hubPageId);
    const treatmentPlans = await createTreatmentPlansDatabase(hubPageId);
    const sessionNotes = await createSessionNotesDatabase(hubPageId);
    const bibliographies = await createBibliographiesDatabase(hubPageId);
    const articles = await createArticlesDatabase(hubPageId);
    const rubrics = await createRubricsDatabase(hubPageId);
    const textbooks = await createTextbooksDatabase(hubPageId);

    // Update relationships
    await updateRelationships({
      assignments,
      treatmentPlans,
      sessionNotes,
      bibliographies,
      articles,
      rubrics,
    });

    // Save to config
    const configPath = join(repoRoot, '.notion-config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    config.academicDatabases = {
      assignments,
      treatmentPlans,
      sessionNotes,
      bibliographies,
      articles,
      rubrics,
      textbooks,
    };
    
    const { writeFileSync } = await import('fs');
    writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log('\n✅ All databases created successfully!');
    console.log('\n📊 Database IDs saved to .notion-config.json');
    console.log('\n🔗 View your databases in Notion:');
    console.log(`   Assignments: https://www.notion.so/${assignments.replace(/-/g, '')}`);
    console.log(`   Treatment Plans: https://www.notion.so/${treatmentPlans.replace(/-/g, '')}`);
    console.log(`   Session Notes: https://www.notion.so/${sessionNotes.replace(/-/g, '')}`);
    console.log(`   Bibliographies: https://www.notion.so/${bibliographies.replace(/-/g, '')}`);
    console.log(`   Articles: https://www.notion.so/${articles.replace(/-/g, '')}`);
    console.log(`   Rubrics & Guides: https://www.notion.so/${rubrics.replace(/-/g, '')}`);
    console.log(`   Textbooks & Resources: https://www.notion.so/${textbooks.replace(/-/g, '')}`);

  } catch (error) {
    console.error('\n❌ Error creating databases:', error.message);
    if (error.code === 'object_not_found') {
      console.error('\n💡 Tip: Make sure the HUB page exists and is accessible to your integration');
    }
    process.exit(1);
  }
}

main();

