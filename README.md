# MSW-REPO

**Masters in Social Work Program Repository**

A comprehensive, personalized graduate student hub for managing coursework, assignments, research, web applications, and automation workflows. This repository works in conjunction with **Notion as the primary programmatic frontend**, storing files, documents, notes, papers, articles, and homework assignments while leveraging modern development tools including pnpm workspaces, Next.js with Turbopack, and MCP server integrations.

## 🎯 Notion Integration

**Notion serves as the primary programmatic frontend** for managing all academic content through the **Official Notion MCP** (OAuth-based), connected via Cursor IDE.

- **Integration Method**: Official Notion Hosted MCP (OAuth)
- **Status**: ✅ Connected and Verified
- **Workspace**: MOODMNKY LLC → MSW H.Q. Teamspace
- **Integration**: SCHOLAR MNKY
- **Database**: MSW-REPO Academic Files (`2becd2a6-5422-816e-93b6-e3db7b4af11b`)

**Primary Method**: Use Cursor chat with Notion MCP for all Notion operations. See [Official Notion MCP Setup](docs/NOTION_MCP_OFFICIAL_SETUP.md) for details.

**Alternative Methods**: Direct API calls via scripts (see [Notion Integration Guide](docs/NOTION_INTEGRATION.md)) are available for automation but Notion MCP is the primary interface.

## 📁 Repository Structure

```
MSW-REPO/
├── courses/              # Course-specific content
│   └── SOCW-6510/       # Example course structure
│       ├── assignments/ # Course assignments
│       ├── papers/      # Research papers
│       ├── articles/    # Academic articles
│       ├── notes/       # Class notes and materials
│       ├── research/    # Research materials
│       ├── projects/    # Course projects
│       └── documents/   # Other documents
├── storage/             # Centralized file storage
│   ├── documents/       # General documents
│   ├── papers/          # Research papers
│   └── articles/        # Academic articles
├── apps/                # Web applications (Next.js apps)
├── tools/               # Shared utilities and scripts
│   └── notion-integration/  # Notion API integration tools
├── workflows/           # n8n workflow definitions (JSON)
│   └── notion-sync/     # Notion synchronization workflows
├── docs/                # Documentation
├── .cursor/             # Cursor IDE configuration
│   └── mcp.json        # MCP server configurations
├── .notion-config.json  # Notion database configuration
├── package.json         # Root package.json (shared dependencies)
├── pnpm-workspace.yaml # pnpm workspace configuration
└── .gitignore          # Git ignore patterns
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (install via `npm install -g pnpm`)
- Git
- Cursor IDE (for MCP server integration)
- Notion account with SCHOLAR MNKY integration access

### Initial Setup

1. **Clone the repository** (after GitHub setup):
   ```bash
   git clone <repository-url>
   cd MSW-REPO
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Notion Integration**:
   - **Primary**: Official Notion MCP is configured via Cursor (OAuth-based)
   - **Alternative**: Direct API scripts available (see `tools/notion-integration/`)
   - Database is already configured (see `.notion-config.json`)
   - Integration: SCHOLAR MNKY → MSW H.Q. Teamspace

4. **Verify Setup**:
   ```bash
   cd tools/notion-integration
   pnpm run verify
   ```

## 🛠️ Development

### Creating a New Course Workspace

1. Create course directory:
   ```bash
   mkdir -p courses/SOCW-XXXX
   ```

2. Create subdirectories:
   ```bash
   cd courses/SOCW-XXXX
   mkdir assignments notes research projects papers articles documents
   ```

3. Sync to Notion:
   ```bash
   cd ../../tools/notion-integration
   pnpm run sync SOCW-XXXX
   ```

### Creating a New Web Application

1. Create Next.js app in apps directory:
   ```bash
   cd apps
   npx create-next-app@latest my-app --typescript --tailwind --app
   ```

2. Turbopack is enabled by default in Next.js 14+

3. Run development server:
   ```bash
   pnpm --filter my-app dev
   ```

### Syncing Files to Notion

Sync repository files to the Notion database:

```bash
cd tools/notion-integration
pnpm run sync [course-code]
```

Or sync all courses:
```bash
pnpm run sync
```

## 📦 Dependency Management

### Shared Dependencies

Shared development dependencies are managed at the root level in `package.json`. These include:
- TypeScript
- ESLint
- Prettier
- Other shared tooling

### Application Dependencies

Each application in `apps/` manages its own runtime dependencies in its `package.json`.

## 🎯 Notion Integration (Primary Frontend)

**Notion serves as the primary programmatic frontend** for managing all academic content. The repository stores files, while Notion provides the interface for organization, metadata, and workflow management.

### Key Features

- **Bidirectional Sync**: Keep Notion databases and repository files synchronized
- **Automated Organization**: Files automatically organized based on Notion database entries
- **Metadata Management**: Link file properties with Notion database fields
- **Workflow Automation**: n8n workflows for seamless integration

### Quick Start

1. **Database Already Created**: The MSW-REPO Academic Files database is set up
2. **Sync Files**: Run `cd tools/notion-integration && pnpm run sync`
3. **Manage in Notion**: Use Notion as your primary interface

For detailed setup and usage, see:
- [Notion Integration Documentation](docs/NOTION_INTEGRATION.md)
- [Integration Info](docs/INTEGRATION_INFO.md)
- [Database Setup Complete](docs/DATABASE_SETUP_COMPLETE.md)

## 🔧 MCP Server Integration

This repository is configured to work with Cursor IDE's MCP (Model Context Protocol) servers for enhanced productivity:

- **Notion MCP** ⭐ **PRIMARY**: Official Notion Hosted MCP (OAuth) - Primary interface for all Notion operations
  - Connected via OAuth through Notion app
  - Use Cursor chat to interact with Notion workspace
  - See [Official Notion MCP Setup](docs/NOTION_MCP_OFFICIAL_SETUP.md)
- **GitHub MCP**: Version control operations
- **Research MCPs**: Tavily, Brave Search for research
- **Filesystem MCP**: File operations
- **Other MCPs**: As configured in `.cursor/mcp.json`

## 📝 Best Practices

### Version Control

- Use descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Create feature branches for major work
- Keep `main` branch stable and deployable

### File Organization

- Use clear, descriptive file names
- Follow consistent naming conventions (YYYY-MM-DD for dates)
- Organize by course → assignment/project → files
- Sync files to Notion for metadata management

### Documentation

- Update README when adding new courses or major features
- Document workflow automation in `docs/workflows/`
- Keep course-specific notes in respective course directories
- Use Notion for detailed notes and annotations

## 🔐 Security

- Never commit sensitive information (API keys, passwords)
- Use environment variables for configuration (`.env` is gitignored)
- Review `.gitignore` to ensure sensitive files are excluded
- Keep dependencies updated for security patches
- Notion API key stored securely in `.env` file

## 📚 Resources

### Documentation
- [Notion Integration - Primary Method](docs/NOTION_INTEGRATION_PRIMARY.md) ⭐ **PRIMARY** - Official Notion MCP (OAuth)
- [Integration Status](docs/INTEGRATION_STATUS.md) - Current integration status and verification
- [Official Notion MCP Setup](docs/NOTION_MCP_OFFICIAL_SETUP.md) - Complete setup guide
- [Notion MCP Quick Start](docs/MCP_SETUP_QUICK_START.md) - Quick reference guide
- [Notion Integration Guide](docs/NOTION_INTEGRATION.md) - Direct API integration (alternative method)
- [Integration Info](docs/INTEGRATION_INFO.md) - SCHOLAR MNKY integration details
- [Database Setup Complete](docs/DATABASE_SETUP_COMPLETE.md) - Database configuration
- [Repository Structure](docs/STRUCTURE.md) - Detailed structure documentation
- [Setup Guide](docs/SETUP.md) - Initial setup instructions

### External Resources
- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turbopack Documentation](https://nextjs.org/docs/app/api-reference/turbopack)
- [Notion API Documentation](https://developers.notion.com/)
- [n8n Documentation](https://docs.n8n.io/)
- [Cursor MCP Documentation](https://cursor.com/docs/context/mcp)

## 📄 License

[Add your license here]

## 👤 Author

[Your Name]

---

**Note**: This repository structure is designed to grow with your academic journey. Add courses, projects, and tools as needed while maintaining the organizational structure. Notion serves as your primary interface for managing all academic content via the Official Notion MCP (OAuth) integration.
