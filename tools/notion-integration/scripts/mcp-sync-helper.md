# MCP Sync Helper - Instructions for Cursor Chat

This document provides ready-to-use prompts for Cursor chat to interact with your Notion database via the MCP server.

## Setup Verification

First, verify the MCP server is working:

```
"Can you search for databases in my Notion workspace using the Notion MCP server?"
```

## Create Database

If you need to create the database:

```
"Using the Notion MCP server, create a new database called 'MSW-REPO Academic Files' in my Notion workspace. Add these properties:
- Title (title property)
- Course (select property with options: SOCW-6510)
- Type (select property with options: Assignment, Paper, Article, Note, Research, Project, Document)
- Category (select property with same options as Type)
- Status (select property with options: Draft, In Progress, Completed, Submitted, Archived)
- Due Date (date property)
- Tags (multi-select property)
- File Path (rich_text property)"
```

## Sync Files to Notion

To sync a specific course:

```
"Using the Notion MCP server, I want to sync files from my repository. 
Scan the directory 'courses/SOCW-6510' and for each file found, create or update an entry in the 'MSW-REPO Academic Files' database with:
- Title: filename
- Course: SOCW-6510
- Type: determined from file extension (PDF=Paper, MD=Note, DOCX=Document)
- Category: determined from directory (assignments/, papers/, notes/, etc.)
- File Path: relative path from repository root"
```

## Query Database

Find specific entries:

```
"Query the 'MSW-REPO Academic Files' database for all entries where Course is SOCW-6510 and Type is Assignment"
```

```
"Show me all entries in 'MSW-REPO Academic Files' database that have Status 'In Progress'"
```

## Create Entry

Add a new entry:

```
"Create a new entry in 'MSW-REPO Academic Files' database:
Title: Assignment 01 - Social Policy Analysis
Course: SOCW-6510
Type: Assignment
Status: In Progress
Due Date: 2024-12-15
File Path: courses/SOCW-6510/assignments/assignment-01.md"
```

## Update Entry

Modify an existing entry:

```
"Update the entry in 'MSW-REPO Academic Files' database with Title 'Assignment 01' to set Status to 'Completed'"
```

## Bulk Operations

Sync all courses:

```
"Scan all directories under 'courses/' in my repository. For each file found, create or update an entry in 'MSW-REPO Academic Files' database. Extract course code from directory name, file type from extension, and category from subdirectory name."
```

## Advanced Queries

Find overdue assignments:

```
"Query 'MSW-REPO Academic Files' database for entries where Type is 'Assignment', Status is not 'Completed' or 'Submitted', and Due Date is before today"
```

Find files by tag:

```
"Query 'MSW-REPO Academic Files' database for entries that have 'research' in their Tags"
```

## File Organization

Organize files based on Notion entries:

```
"For each entry in 'MSW-REPO Academic Files' database, check if the file at File Path exists. If not, create the directory structure and a placeholder file based on the entry properties."
```

## Tips

1. **Be specific**: Include database name and property names exactly as they appear
2. **Use file paths**: Always use relative paths from repository root
3. **Batch operations**: Ask Cursor to process multiple files at once
4. **Verify first**: Query the database before making changes
5. **Error handling**: Ask Cursor to report any errors or missing files

## Example Workflow

Complete sync workflow:

```
"1. First, query 'MSW-REPO Academic Files' database to show me all current entries
2. Then, scan 'courses/SOCW-6510' directory for all files
3. For each file found, check if an entry exists with matching File Path
4. If not, create a new entry with appropriate properties
5. If yes, update the entry if file metadata has changed
6. Report summary of created/updated entries"
```

