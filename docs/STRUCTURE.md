# Repository Structure Documentation

## Overview

This document provides detailed information about the MSW-REPO structure and organization principles.

## Directory Structure

### `/courses/`

Contains course-specific content organized by course code (e.g., SOCW-6510). Each course directory follows a consistent structure:

- **assignments/**: Course assignments, submissions, and related materials
- **notes/**: Class notes, lecture materials, study guides, and annotations
- **research/**: Research papers, articles, literature reviews, and academic materials
- **projects/**: Course projects, presentations, and major deliverables

**Naming Convention**: Use course codes (e.g., `SOCW-6510`) as directory names.

### `/apps/`

Web applications built with Next.js. Each application is a self-contained Next.js project with its own `package.json` and dependencies.

**Best Practices**:
- Use descriptive names for applications
- Each app should have its own README.md
- Turbopack is enabled by default in Next.js 14+

### `/tools/`

Shared utilities, scripts, and helper functions that can be used across courses or projects.

**Examples**:
- Data processing scripts
- Utility functions
- Shared configuration files

### `/workflows/`

n8n workflow definitions stored as JSON files. These workflows can be imported into n8n for automation.

**Naming Convention**: `workflow-name-v1.json`, `workflow-name-v2.json`, etc.

**Best Practices**:
- Version your workflows
- Document workflow purpose in comments or separate markdown files
- Keep credentials separate (use environment variables in n8n)

### `/docs/`

Repository-wide documentation, guides, and reference materials.

**Contents**:
- Structure documentation (this file)
- Setup guides
- Workflow documentation
- Best practices

### `/.cursor/`

Cursor IDE configuration files, including MCP server configurations.

**Note**: `.cursor/` is in `.gitignore` by default. Remove from `.gitignore` if you want to version control MCP configurations (without sensitive keys).

## File Naming Conventions

### Academic Files

- Use descriptive names: `assignment-01-social-policy-analysis.md`
- Include dates when relevant: `2024-01-15-lecture-notes.md`
- Use consistent separators: hyphens (`-`) or underscores (`_`)

### Code Files

- Follow language-specific conventions
- Use descriptive names that indicate purpose
- Maintain consistent naming across projects

## Dependency Management

### Root Level (`package.json`)

Contains shared development dependencies:
- TypeScript
- ESLint, Prettier (when added)
- Other shared tooling

### Application Level

Each application in `/apps/` manages its own:
- Runtime dependencies
- Build configurations
- Application-specific scripts

## Version Control Strategy

### Branching

- `main`: Stable, production-ready code
- `feature/<description>`: New features or major changes
- `course/<course-code>`: Course-specific work (optional)

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `course:` Course-related work

## Adding New Content

### Adding a New Course

1. Create directory: `courses/COURSE-CODE/`
2. Create subdirectories: `assignments/`, `notes/`, `research/`, `projects/`
3. Add `README.md` with course information
4. Update main `README.md` if needed

### Adding a New Application

1. Create Next.js app in `apps/` directory
2. Ensure it has its own `package.json`
3. Add README.md with app-specific documentation
4. Update root `README.md` if needed

### Adding a New Workflow

1. Export workflow from n8n as JSON
2. Save to `workflows/` with descriptive name
3. Document workflow purpose (in JSON comments or separate markdown)
4. Update workflow documentation if needed

## Best Practices

1. **Keep it organized**: Follow the established structure
2. **Document everything**: Add README files where helpful
3. **Version control**: Commit frequently with clear messages
4. **Security**: Never commit sensitive information
5. **Consistency**: Use consistent naming and organization patterns

