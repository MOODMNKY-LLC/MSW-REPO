/**
 * Notion API Helper Functions
 * 
 * Provides helper functions for working with Notion API version 2025-09-03
 * Includes data source discovery and migration utilities
 */

import { Client } from '@notionhq/client';
import { config } from 'dotenv';

config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;

/**
 * Create Notion client with 2025-09-03 API version
 */
export function createNotionClient() {
  return new Client({
    auth: NOTION_API_KEY,
    notionVersion: '2025-09-03',
  });
}

/**
 * Get data source ID from a database ID
 * 
 * According to Notion API 2025-09-03, databases can have multiple data sources.
 * This function retrieves the first (default) data source ID.
 * 
 * @param {string} databaseId - The database ID
 * @returns {Promise<string>} The data source ID
 */
export async function getDataSourceId(databaseId) {
  const notion = createNotionClient();
  
  try {
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    if (!database.data_sources || database.data_sources.length === 0) {
      throw new Error(`No data sources found for database ${databaseId}`);
    }
    
    // For single-source databases (most common case), return the first data source
    const dataSource = database.data_sources[0];
    return dataSource.id;
  } catch (error) {
    console.error(`Error fetching data source for database ${databaseId}:`, error.message);
    throw error;
  }
}

/**
 * Get all data sources for a database
 * 
 * @param {string} databaseId - The database ID
 * @returns {Promise<Array>} Array of data source objects with id and name
 */
export async function getDataSources(databaseId) {
  const notion = createNotionClient();
  
  try {
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    return database.data_sources || [];
  } catch (error) {
    console.error(`Error fetching data sources for database ${databaseId}:`, error.message);
    throw error;
  }
}

/**
 * Create a page with data source parent (2025-09-03 compatible)
 * 
 * @param {string} dataSourceId - The data source ID
 * @param {object} properties - Page properties
 * @returns {Promise<object>} Created page
 */
export async function createPageInDataSource(dataSourceId, properties) {
  const notion = createNotionClient();
  
  return await notion.pages.create({
    parent: {
      type: 'data_source_id',
      data_source_id: dataSourceId,
    },
    properties,
  });
}

/**
 * Query a data source (2025-09-03 compatible)
 * 
 * @param {string} dataSourceId - The data source ID
 * @param {object} options - Query options (filter, sorts, etc.)
 * @returns {Promise<object>} Query results
 */
export async function queryDataSource(dataSourceId, options = {}) {
  const notion = createNotionClient();
  
  return await notion.dataSources.query({
    data_source_id: dataSourceId,
    ...options,
  });
}

/**
 * Get data source details
 * 
 * @param {string} dataSourceId - The data source ID
 * @returns {Promise<object>} Data source object
 */
export async function getDataSource(dataSourceId) {
  const notion = createNotionClient();
  
  return await notion.dataSources.retrieve({
    data_source_id: dataSourceId,
  });
}

/**
 * Update a data source property
 * 
 * @param {string} dataSourceId - The data source ID
 * @param {object} properties - Properties to update
 * @returns {Promise<object>} Updated data source
 */
export async function updateDataSource(dataSourceId, properties) {
  const notion = createNotionClient();
  
  return await notion.dataSources.update({
    data_source_id: dataSourceId,
    properties,
  });
}

/**
 * Migrate database ID to data source ID
 * 
 * Helper function to get data source ID from config or fetch it
 * 
 * @param {string} databaseId - The database ID
 * @param {object} config - Optional config object with cached data source IDs
 * @returns {Promise<string>} The data source ID
 */
export async function migrateDatabaseToDataSource(databaseId, config = {}) {
  // Check if we have a cached data source ID
  if (config.dataSources && config.dataSources[databaseId]) {
    return config.dataSources[databaseId];
  }
  
  // Fetch from API
  const dataSourceId = await getDataSourceId(databaseId);
  
  // Cache it if config object provided
  if (config.dataSources) {
    config.dataSources[databaseId] = dataSourceId;
  }
  
  return dataSourceId;
}

