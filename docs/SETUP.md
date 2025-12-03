# Setup Guide

## Initial Repository Setup

This guide walks you through setting up the MSW-REPO repository for the first time.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org/)
- **pnpm** (v9 or higher): Install via `npm install -g pnpm`
- **Git**: [Download Git](https://git-scm.com/)
- **Cursor IDE**: [Download Cursor](https://cursor.com/) (for MCP server integration)
- **Docker** (optional, for MCP servers): [Download Docker](https://www.docker.com/)

## Step 1: Clone the Repository

If you haven't already cloned the repository:

```bash
git clone <your-repository-url>
cd MSW-REPO
```

## Step 2: Install Dependencies

Install all workspace dependencies:

```bash
pnpm install
```

This will install shared dependencies defined in the root `package.json`.

## Step 3: Configure MCP Servers

1. Copy the MCP configuration example:
   ```bash
   cp mcp.json.example .cursor/mcp.json
   ```

2. Edit `.cursor/mcp.json` and add your API keys:
   - Set up environment variables for API keys (recommended)
   - Or replace `${VARIABLE_NAME}` placeholders with actual keys

3. Available MCP servers:
   - **GitHub**: Requires `GITHUB_TOKEN` environment variable
   - **Notion**: Requires `NOTION_API_KEY` environment variable
   - **Brave Search**: Requires `BRAVE_API_KEY` environment variable
   - **Tavily**: Requires `TAVILY_API_KEY` environment variable
   - **Firecrawl**: Requires `FIRECRAWL_API_KEY` environment variable

## Step 4: Set Up Environment Variables

Create a `.env` file in the root directory (this file is gitignored):

```bash
# GitHub
GITHUB_TOKEN=your_github_token_here

# Notion
NOTION_API_KEY=your_notion_api_key_here

# Research APIs
BRAVE_API_KEY=your_brave_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

**Security Note**: Never commit `.env` files or API keys to the repository.

## Step 5: Verify Setup

1. **Check pnpm workspace**:
   ```bash
   pnpm list -r
   ```

2. **Verify Git repository**:
   ```bash
   git status
   ```

3. **Test MCP servers** (in Cursor IDE):
   - Open Cursor IDE
   - Check MCP server status in settings
   - Verify servers are connected

## Step 6: Create Your First Course

1. Create a new course directory:
   ```bash
   mkdir -p courses/COURSE-CODE
   ```

2. Create course subdirectories:
   ```bash
   cd courses/COURSE-CODE
   mkdir assignments notes research projects
   ```

3. Add a README.md:
   ```bash
   echo "# COURSE-CODE\n\n[Course description]" > README.md
   ```

## Step 7: Create Your First Web Application

1. Navigate to apps directory:
   ```bash
   cd apps
   ```

2. Create a Next.js app:
   ```bash
   npx create-next-app@latest my-app --typescript --tailwind --app
   ```

3. Navigate to your app and install dependencies:
   ```bash
   cd my-app
   pnpm install
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

   Turbopack is enabled by default in Next.js 14+.

## Step 8: Connect to GitHub

If you haven't already connected your local repository to GitHub:

1. Create a new repository on GitHub
2. Add the remote:
   ```bash
   git remote add origin <your-github-repo-url>
   ```

3. Push your code:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Next Steps

- Review the [Structure Documentation](./STRUCTURE.md) for detailed organization guidelines
- Read the [README.md](../README.md) for repository overview
- Start adding your course content and projects
- Explore MCP server capabilities in Cursor IDE

## Troubleshooting

### pnpm Issues

If you encounter pnpm-related issues:

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### MCP Server Issues

- Ensure Docker is running (for Docker-based MCP servers)
- Check API keys are correctly set in environment variables
- Verify MCP server configuration in `.cursor/mcp.json`
- Restart Cursor IDE after configuration changes

### Git Issues

- Ensure `.gitignore` is properly configured
- Check that sensitive files are not being tracked
- Verify remote repository connection

## Getting Help

- Review repository documentation in `/docs`
- Check individual course README files
- Consult tool-specific documentation (Next.js, pnpm, n8n, etc.)

