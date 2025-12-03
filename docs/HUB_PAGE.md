# HUB Page - Landing Page for MSW-REPO Integration

## Overview

The **HUB** page serves as the central landing page and home for the MSW-REPO Notion integration. It provides a beautiful, organized entry point to all your academic resources and tools.

## Page Details

- **Page Name**: HUB
- **Page ID**: `2becd2a6-5422-8043-8939-e4bb0316a593`
- **Page URL**: https://www.notion.so/2becd2a6542280438939e4bb0316a593
- **Purpose**: Central command center and landing page
- **Status**: ✅ Configured with hero content

## Content Structure

The HUB page includes:

### 🎓 Hero Section
- Welcome message and introduction
- Clear value proposition for the graduate student hub

### 🚀 Quick Access
- Links to key resources
- Navigation to important areas
- Quick reference items

### ✨ Features Section
Three-column layout highlighting:
- **File Management** - Store and organize academic files
- **Sync & Automation** - Bidirectional sync and workflows
- **Course Organization** - Organized course workspaces

### 🔗 Integration Details
- SCHOLAR MNKY integration information
- Teamspace details
- Repository connection

### 📖 Getting Started
Expandable toggles with:
- How to sync files from repository
- How to add a new course
- How to use Cursor MCP integration

## Updating the HUB Page

To update the HUB page content, use the update script:

```bash
cd tools/notion-integration
$env:NOTION_API_KEY='your_api_key'
node scripts/update-hub-page.js
```

Or manually edit in Notion:
1. Open the HUB page
2. Click "Edit" to modify content
3. Add/remove blocks as needed
4. Use Notion's formatting options for styling

## Customization

### Adding New Sections

You can add new sections by editing the `heroContent` array in `tools/notion-integration/scripts/update-hub-page.js`. Available block types include:

- `heading_1`, `heading_2`, `heading_3` - Headings
- `paragraph` - Text paragraphs
- `bulleted_list_item` - Bullet points
- `numbered_list_item` - Numbered lists
- `toggle` - Expandable sections
- `callout` - Highlighted callout boxes
- `divider` - Visual separators
- `column_list` - Multi-column layouts
- `code` - Code blocks

### Styling Options

Notion supports various text annotations:
- **Bold** (`bold: true`)
- *Italic* (`italic: true`)
- Colors (`color: 'blue'`, `'green'`, `'purple'`, etc.)
- Background colors for callouts

### Adding Links

To add links to other Notion pages or external URLs:

```javascript
{
  type: 'text',
  text: {
    content: 'Link Text',
    link: {
      url: 'https://notion.so/page-id' // or external URL
    }
  }
}
```

## Best Practices

1. **Keep it Updated**: Update the HUB page when adding new features or resources
2. **Clear Navigation**: Ensure all important pages are easily accessible
3. **Visual Hierarchy**: Use headings and dividers to organize content
4. **Concise Content**: Keep descriptions brief and actionable
5. **Regular Maintenance**: Review and update quarterly or when major changes occur

## Integration with Other Pages

The HUB page should link to:
- Academic Files Database
- Course-specific pages
- Documentation pages
- Integration tools
- Workflow pages

## Script Reference

The update script (`update-hub-page.js`) can be customized to:
- Change hero content
- Add new sections
- Update styling
- Modify layout

See the script for the complete content structure and customization options.

