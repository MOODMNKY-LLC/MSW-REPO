# Academic Management System Documentation

## Overview

The Academic Management System provides a comprehensive Notion-based solution for managing MSW coursework, assignments, treatment plans, session notes, bibliographies, and academic resources. All databases are integrated with the repository file structure for programmatic access and synchronization.

## Database Structure

### 1. Assignments Database

**Purpose**: Central hub for tracking all coursework and assignments.

**Key Properties**:
- **Title** - Assignment name
- **Course** - Course code (SOCW-6510, etc.)
- **Type** - Treatment Plan, Session Note, Bibliography, Research Paper, etc.
- **Status** - Not Started, In Progress, Completed, Submitted, Graded
- **Due Date** - Assignment deadline
- **Rubric** - Link to Rubrics & Guides database
- **Related Treatment Plan** - Link to Treatment Plans database
- **Related Session Notes** - Link to Session Notes database
- **Related Bibliography** - Link to Annotated Bibliographies database
- **Files** - Attached assignment files
- **Notes** - Additional notes and comments

**Database ID**: `2becd2a6-5422-8106-9250-d5544fd63818`

### 2. Treatment Plans Database

**Purpose**: Store treatment plans based on case studies from textbooks.

**Key Properties**:
- **Client Name** - Case study client name (e.g., "Denise", "Barbara")
- **Case Study Source** - Reference (e.g., "Barlow p. 287")
- **Treatment Modality** - CBT, BA, ST, DBT, Other
- **Status** - Draft, In Progress, Completed, Submitted
- **Assignment** - Link to Assignments database
- **File** - Treatment plan document
- **Notes** - Additional notes

**Database ID**: `2becd2a6-5422-81ca-aea9-fea856b84526`

**Use Cases**:
- Treatment plans for Denise (CBT, Barlow p. 287)
- Treatment plans for Barbara (ST, Barlow p. 296)
- Treatment plans for Héctor (CBT for GAD, Barlow p. 196)
- Treatment plans for Mark (BA, Barlow p. 355)

### 3. Session Notes Database

**Purpose**: Store SOAP format session notes based on case studies.

**Key Properties**:
- **Client Name** - Case study client name
- **Date** - Session date
- **Case Study Source** - Reference (e.g., "Barlow p. 238")
- **SOAP S** - Subjective section
- **SOAP O** - Objective section
- **SOAP A** - Assessment section
- **SOAP P** - Plan section
- **Treatment Plan** - Link to related Treatment Plan
- **Assignment** - Link to Assignments database
- **File** - Session note document

**Database ID**: `2becd2a6-5422-8101-9683-ee3016ca2f87`

**Use Cases**:
- SOAP notes for Marianne (Barlow p. 238)
- Session notes linked to treatment plans
- Clinical documentation for coursework

### 4. Annotated Bibliographies Database

**Purpose**: Manage annotated bibliographies for research papers.

**Key Properties**:
- **Topic** - Research topic (e.g., "Attachment Theory")
- **Course** - Course code
- **Status** - Researching, Writing, Completed, Submitted
- **Due Date** - Bibliography deadline
- **Assignment** - Link to Assignments database
- **Articles** - Relation to Articles database
- **Articles Count** - Rollup counting linked articles
- **File** - Bibliography document

**Database ID**: `2becd2a6-5422-8122-b027-ebf51261d743`

**Use Cases**:
- Attachment Theory annotated bibliography (15+ articles)
- Research paper bibliographies
- Literature review preparation

### 5. Articles Database

**Purpose**: Store individual research articles with annotations.

**Key Properties**:
- **Title** - Article title
- **Authors** - Author names
- **Year** - Publication year
- **Journal** - Journal name
- **DOI/URL** - Article link
- **Summary** - 3-4 sentence summary
- **Strengths** - Article strengths
- **Weaknesses** - Article limitations
- **Bibliography** - Link to Annotated Bibliographies database

**Database ID**: `2becd2a6-5422-8116-9c6f-c03e42c5d9ff`

**Use Cases**:
- Individual articles for attachment theory research
- Article annotations and analysis
- Research paper source management

### 6. Rubrics & Guides Database

**Purpose**: Store assignment rubrics, guides, and templates.

**Key Properties**:
- **Title** - Rubric/guide name
- **Type** - Rubric, Guide, Template, Other
- **Course** - Course code or "All Courses"
- **Assignment Type** - Treatment Plan, Session Note, Bibliography, etc.
- **File** - Rubric/guide document
- **Description** - Description of rubric/guide

**Database ID**: `2becd2a6-5422-8131-a577-c9ba08b714f3`

**Use Cases**:
- Treatment plan rubrics
- Session note templates
- Assignment guidelines
- APA formatting guides

### 7. Textbooks & Resources Database

**Purpose**: Manage ebooks, PDFs, and programmatically accessible resources.

**Key Properties**:
- **Title** - Resource title
- **Author** - Author name
- **Type** - Textbook, Article, Guide, Handbook, Other
- **File Path** - Repository file path
- **Course Relevance** - Multi-select course codes
- **Programmatic Access** - Notes on programmatic usage
- **File** - Resource file

**Database ID**: `2becd2a6-5422-81bb-97d6-c855590f60d7`

**Use Cases**:
- Clinical Handbook of Psychological Disorders (6th Edition)
- Course textbooks
- Reference materials
- Programmatic text extraction and analysis

## Repository File Structure

Files are organized in the repository under `storage/` directories:

```
storage/
├── textbooks/          # Ebooks and PDFs
├── assignments/        # Assignment files
├── rubrics/            # Rubric documents
├── session-notes/      # Session note files
├── treatment-plans/     # Treatment plan documents
├── bibliographies/     # Bibliography files
└── certificates/       # Certs and sharables
```

## Database Relationships

```
Assignments
├──→ Rubrics & Guides (many-to-one)
├──→ Treatment Plans (one-to-many)
├──→ Session Notes (one-to-many)
└──→ Annotated Bibliographies (one-to-many)

Treatment Plans
├──→ Assignments (many-to-one)
└──→ Session Notes (one-to-many)

Session Notes
├──→ Treatment Plans (many-to-one)
└──→ Assignments (many-to-one)

Annotated Bibliographies
├──→ Assignments (many-to-one)
└──→ Articles (one-to-many)

Articles
└──→ Annotated Bibliographies (many-to-one)
```

## Usage Examples

### Creating a Treatment Plan Entry

1. Open Treatment Plans database in Notion
2. Click "New" to create entry
3. Fill in:
   - Client Name: "Denise"
   - Case Study Source: "Barlow p. 287"
   - Treatment Modality: "CBT"
   - Status: "In Progress"
4. Link to Assignment (if applicable)
5. Upload treatment plan file
6. Add notes

### Creating a Session Note Entry

1. Open Session Notes database
2. Create new entry
3. Fill in:
   - Client Name: "Marianne"
   - Date: Session date
   - Case Study Source: "Barlow p. 238"
4. Complete SOAP sections:
   - SOAP S: Subjective observations
   - SOAP O: Objective observations
   - SOAP A: Assessment
   - SOAP P: Plan
5. Link to Treatment Plan and Assignment
6. Upload session note file

### Managing Annotated Bibliography

1. Create entry in Annotated Bibliographies database
2. Set Topic: "Attachment Theory"
3. Add Articles:
   - Create entries in Articles database
   - Fill in Title, Authors, Year, Journal, DOI/URL
   - Add Summary, Strengths, Weaknesses
   - Link to Bibliography
4. Articles Count rollup automatically updates
5. Upload completed bibliography file

## Scripts and Automation

### Available Scripts

- `create-academic-databases.js` - Creates all databases (run once)
- `update-hub-academic-section.js` - Adds Academic Management section to HUB
- `sync-files-to-notion.js` - Syncs repository files to Notion
- `fix-relations.js` - Fixes missing database relations

### Running Scripts

```bash
cd tools/notion-integration
$env:NOTION_API_KEY='your_api_key'
node scripts/script-name.js
```

## Integration with Repository

### File Storage

- All files stored in `storage/` directories
- Files synced to Notion databases
- File paths stored in database properties
- Programmatic access via file paths

### Programmatic Access

Textbooks and resources can be accessed programmatically:

```javascript
// Example: Access textbook file
const filePath = 'storage/textbooks/barlow-clinical-handbook-6th-ed.pdf';
// Use for text extraction, citation, etc.
```

## Best Practices

1. **Consistent Naming**: Use consistent naming for case studies (e.g., "Denise", "Barbara")
2. **Source Citations**: Always include case study source (e.g., "Barlow p. 287")
3. **File Organization**: Store files in appropriate `storage/` subdirectories
4. **Link Relationships**: Use database relations to connect related content
5. **Status Tracking**: Keep assignment and content status updated
6. **Regular Sync**: Sync files regularly to keep Notion and repository in sync

## Troubleshooting

### Missing Relations

If database relations are missing, run:
```bash
node scripts/fix-relations.js
```

### Database Not Found

Check `.notion-config.json` for correct database IDs.

### Files Not Syncing

Ensure file paths are correct and files exist in repository.

## Next Steps

1. Add sample entries to each database
2. Create templates for common assignment types
3. Set up automated sync workflows
4. Create views and filters for better organization
5. Add custom properties as needed

## Resources

- [Notion Integration Guide](./NOTION_INTEGRATION.md)
- [Database Setup Complete](./DATABASE_SETUP_COMPLETE.md)
- [HUB Page Documentation](./HUB_PAGE.md)

