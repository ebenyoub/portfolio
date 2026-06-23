# Portfolio Project Rules

## Scope

This repository contains Elyas Benyoub's professional portfolio.

- Frontend: `portfolio_frontend/`
- Backend: `portfolio_backend/`
- Fresh database source of truth: `db/init.sql`
- Local AI skill: `ai/skills/portfolio-maintainer/`

## Stack

- React 19, TypeScript, Vite, React Router
- React Hook Form, Zod
- Tailwind CSS v4
- Express 5, TypeScript, MySQL2
- JWT, Nodemailer, Multer
- Docker Compose, MySQL 8

## Database Rules

Always mirror schema and important seed changes in `db/init.sql`.

Current project media fields:

- `image_url`
- `gallery_images`
- `display_settings`
- `github_url`
- `demo_url`
- `is_featured`
- `featured_order`

Do not store uploaded files in the database. Store only paths or URLs.

## CMS Rules

Do not break:

- `/login`
- `/admin`
- `/admin/projects/new`
- `/admin/projects/:id/edit`

All project forms must keep frontend and backend validation aligned.

## Home Carousel

The home carousel is driven by:

- `is_featured = 1`
- `featured_order`

The dashboard controls selection and order. If no project is selected, the home carousel must render nothing.

## Project Gallery

The project detail carousel uses `gallery_images`.

If no image exists:

- keep `gallery_images` empty or null;
- keep `display_settings.show_gallery` false;
- do not show an empty carousel.

## GitHub Import

When adding repositories:

1. Fetch README.
2. Fetch languages and topics.
3. Detect GitHub Pages demos.
4. Enrich only from factual repository evidence.
5. Avoid duplicates by GitHub URL and normalized title.

Never invent features, technologies, URLs, screenshots, or demos.

## Screenshots

For automatic screenshots:

- wait for `domcontentloaded`;
- wait for network idle when possible;
- add a safety delay;
- inspect page body text and visible elements;
- skip blank or incomplete pages.

Use:

```bash
cd portfolio_frontend
npm run screenshots:capture
```

## Required Validation

Run before final response after code or schema changes:

```bash
cd portfolio_frontend && npm run lint && npm run build
cd ../portfolio_backend && npm run lint && npm run build
```
