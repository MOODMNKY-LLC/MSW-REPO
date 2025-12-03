# File Storage and Deployment Guide

## Overview

This guide explains how files are stored in the repository and how to deploy them for access via GitHub URLs in Notion.

## File Storage Locations

Files are organized in the `storage/` directory:

```
storage/
├── textbooks/          # Course textbooks and PDFs
├── certificates/       # Training certificates and completion documents
├── assignments/        # Assignment files
├── rubrics/           # Rubric documents
├── session-notes/      # Session note files
├── treatment-plans/    # Treatment plan documents
└── bibliographies/     # Bibliography files
```

## Current Files

### Textbooks
- **Location**: `storage/textbooks/SOCW-6510-textbook.pdf`
- **Size**: 9.81 MB
- **Notion Entry**: [SOCW-6510 Course Textbook](https://www.notion.so/SOCW-6510-Course-Textbook-2becd2a65422819690f3e22473bef7d0)

### Certificates
- **Location**: `storage/certificates/SOCW-6510-training-certificate.pdf`
- **Size**: 0.15 MB
- **Notion Entry**: [SOCW-6510 Training Certificate](https://www.notion.so/SOCW-6510-Training-Certificate-2becd2a65422811894b8d874aa8da7ee)

## Deployment Steps

### 1. Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: MSW-REPO academic management system"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `MSW-REPO`
3. **Do NOT** initialize with README (we already have one)
4. Copy the repository URL

### 3. Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/MSW-REPO.git
git branch -M main
git push -u origin main
```

### 4. Update Notion Entries with GitHub URLs

After pushing to GitHub, run:

```bash
node tools/notion-integration/scripts/update-file-urls-after-deployment.js YOUR_USERNAME MSW-REPO main
```

This will update the Notion entries with GitHub raw URLs for direct file access.

## GitHub Raw URLs Format

After deployment, files will be accessible via:

```
https://raw.githubusercontent.com/YOUR_USERNAME/MSW-REPO/main/storage/textbooks/SOCW-6510-textbook.pdf
https://raw.githubusercontent.com/YOUR_USERNAME/MSW-REPO/main/storage/certificates/SOCW-6510-training-certificate.pdf
```

## File Size Considerations

- **GitHub Limit**: 100 MB per file
- **Current Files**: Both files are well under the limit
  - Textbook: 9.81 MB ✅
  - Certificate: 0.15 MB ✅

For files larger than 50 MB, consider using Git LFS (Large File Storage).

## Notion Integration

Files are tracked in the **Textbooks & Resources** database with:
- **Title**: Descriptive name
- **Type**: Textbook, Article, Guide, Handbook, or Other
- **File Path**: Repository path (`storage/textbooks/...`)
- **Course Relevance**: Multi-select course codes
- **Programmatic Access**: GitHub URL for direct access
- **File**: PDF file (uploaded via Notion UI or linked via GitHub URL)

## Adding New Files

1. Place file in appropriate `storage/` subdirectory
2. Run `add-files-to-notion.js` to create Notion entry
3. Commit and push to GitHub
4. Run `update-file-urls-after-deployment.js` to add GitHub URLs

## Alternative: Direct File Upload to Notion

If you prefer to upload files directly to Notion:

1. Open the Notion entry
2. Click on the "File" property
3. Upload the PDF file
4. File will be stored in Notion (20 MB limit per file)

**Note**: GitHub URLs are preferred for:
- Larger files
- Programmatic access
- Version control
- Direct linking

