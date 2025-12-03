/**
 * Fix Missing Database Relations
 */

import { Client } from '@notionhq/client';
import { config } from 'dotenv';

config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function fixRelations() {
  try {
    // Add Assignment and Articles to Bibliographies
    await notion.databases.update({
      database_id: '2becd2a6-5422-8122-b027-ebf51261d743',
      properties: {
        'Assignment': {
          relation: {
            database_id: '2becd2a6-5422-8106-9250-d5544fd63818',
            single_property: {},
          },
        },
        'Articles': {
          relation: {
            database_id: '2becd2a6-5422-8116-9c6f-c03e42c5d9ff',
            single_property: {},
          },
        },
        'Articles Count': {
          rollup: {
            relation_property: 'Articles',
            rollup_property: 'Title',
            function: 'count',
          },
        },
      },
    });

    // Add Bibliography to Articles
    await notion.databases.update({
      database_id: '2becd2a6-5422-8116-9c6f-c03e42c5d9ff',
      properties: {
        'Bibliography': {
          relation: {
            database_id: '2becd2a6-5422-8122-b027-ebf51261d743',
            single_property: {},
          },
        },
      },
    });

    console.log('✅ Relations fixed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixRelations();

