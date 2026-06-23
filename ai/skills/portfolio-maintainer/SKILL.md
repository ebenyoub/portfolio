---
name: portfolio-maintainer
description: Maintain Elyas Benyoub's React/Vite, Express/TypeScript, MySQL portfolio. Use when Codex works in this repository on CMS admin, project data, GitHub imports, screenshots/carousels, database schema, Docker, Markdown documentation, AI context files, or recruiter-facing portfolio quality.
---

# Portfolio Maintainer

## Startup

Run the context sync before making decisions:

```bash
node ai/skills/portfolio-maintainer/scripts/sync-ai-context.mjs --write
```

Then read:

- `AGENTS.md`
- `ai/skills/portfolio-maintainer/references/project-state.md`
- `ai/skills/portfolio-maintainer/references/project-rules.md` when touching architecture, CMS, DB, imports, screenshots, or docs

Run the sync script again after changing Markdown, package scripts, routes, DB schema, Docker config, or project import scripts.

## Workflow

1. Preserve the CMS routes: `/login`, `/admin`, `/admin/projects/new`, `/admin/projects/:id/edit`.
2. Keep schema changes synchronized in `db/init.sql`.
3. Never duplicate projects. Compare by GitHub URL and normalized title.
4. Do not invent project features, technologies, demos, screenshots, or URLs.
5. Keep `gallery_images` empty and `display_settings.show_gallery` false when no real images exist.
6. Use React Hook Form and Zod for frontend forms; keep backend validation coherent.
7. Validate before finishing:

```bash
cd portfolio_frontend && npm run lint && npm run build
cd ../portfolio_backend && npm run lint && npm run build
```

## Common Tasks

### Add Or Update Projects

- Use GitHub metadata, README, repository files, and architecture.
- Prefer factual descriptions over marketing copy.
- Update current MySQL data and `db/init.sql`.
- Keep the portfolio itself out of public project listings.

### Update Home Carousel

- Use `projects.is_featured` and `projects.featured_order`.
- Manage selection from the dashboard.
- Do not show an empty carousel.

### Generate Screenshots

- Use `npm run screenshots:capture` from `portfolio_frontend`.
- Capture only valid `demo_url` pages.
- Wait for DOM, network idle, and safety delay.
- Skip blank, broken, or non-demo pages.

### Update Documentation

- Keep Markdown concise and current.
- After edits, run the sync script so `project-state.md` reflects the new files and checksums.
