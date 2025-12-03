# Manual Notion Update Instructions

## Issue
The Notion entries have an archived ancestor that prevents automated updates. The entries need to be manually updated with GitHub URLs.

## GitHub URLs

### Textbook
- **GitHub URL**: https://raw.githubusercontent.com/MOODMNKY-LLC/MSW-REPO/main/storage/textbooks/SOCW-6510-textbook.pdf
- **Notion Entry**: https://www.notion.so/SOCW-6510-Course-Textbook-2becd2a65422819690f3e22473bef7d0

### Certificate
- **GitHub URL**: https://raw.githubusercontent.com/MOODMNKY-LLC/MSW-REPO/main/storage/certificates/SOCW-6510-training-certificate.pdf
- **Notion Entry**: https://www.notion.so/SOCW-6510-Training-Certificate-2becd2a65422811894b8d874aa8da7ee

## Manual Update Steps

1. **Open the Textbook Entry**:
   - Go to: https://www.notion.so/SOCW-6510-Course-Textbook-2becd2a65422819690f3e22473bef7d0
   - Click on the "Programmatic Access" property
   - Update the text to include:
     ```
     Full-text PDF available for programmatic text extraction and analysis.
     
     GitHub URL: https://raw.githubusercontent.com/MOODMNKY-LLC/MSW-REPO/main/storage/textbooks/SOCW-6510-textbook.pdf
     ```
   - Make the URL clickable by selecting it and adding a link

2. **Open the Certificate Entry**:
   - Go to: https://www.notion.so/SOCW-6510-Training-Certificate-2becd2a65422811894b8d874aa8da7ee
   - Click on the "Programmatic Access" property
   - Update the text to include:
     ```
     Training completion certificate.
     
     GitHub URL: https://raw.githubusercontent.com/MOODMNKY-LLC/MSW-REPO/main/storage/certificates/SOCW-6510-training-certificate.pdf
     ```
   - Make the URL clickable by selecting it and adding a link

## Alternative: Fix Archive Issue First

If you want to fix the archive issue and then use automated scripts:

1. Check if any parent pages/databases are archived in Notion
2. Unarchive any archived ancestors
3. Then run: `node tools/notion-integration/scripts/unarchive-and-update.js`

## Status

✅ **GitHub Repository**: Deployed and accessible
✅ **Files**: Committed and pushed to GitHub
✅ **Notion Entries**: Created with metadata
⚠️ **GitHub URLs**: Need manual update due to archived ancestor issue

