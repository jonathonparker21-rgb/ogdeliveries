# OG Deliveries

A Next.js site wired for headless CMS content (Contentful or Sanity) with clearly labeled ad inventory and compliance
pages for affiliate programs.

## Features

- Above-the-fold, in-article, and sticky sidebar ad slots with accessible labels.
- HTTPS middleware redirect and Strict-Transport-Security header for secure deployments.
- Ready-to-populate About, Contact, Privacy, and Disclaimer pages to support affiliate and ad policy requirements.
- Headless CMS friendly: swap static copy with Contentful/Sanity data using environment variables.
- CDN-friendly Next.js build (static-friendly layout) and lightweight dark theme styling.

## Getting started

```bash
npm install
npm run dev
```

If the registry is firewalled, set a reachable registry first:

```bash
npm config set registry https://registry.npmjs.org/
```

### CMS hooks

Expose your credentials as environment variables and map fetched data into the existing sections (hero, cards, and
sidebar panels) inside `app/page.tsx`.

- **Contentful**: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_TOKEN`
- **Sanity**: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`

### Deployment

- Deploy to a CDN-backed host (Vercel, Netlify Edge) to keep pages fast globally.
- HTTPS is enforced at the edge via `middleware.ts`, and an HSTS header is set in `next.config.mjs`.
- Add your ad network script (e.g., Google Ad Manager) inside `components/AdSlot.tsx` or via a tag manager.

## Structure

- `app/` – App Router pages and global styles.
- `components/` – Layout, ad slots, and reusable UI blocks.
- `data/pages.ts` – Default copy for hero, highlights, and policy sections.
- `middleware.ts` – HTTPS redirect middleware.

## Affiliate & ad clarity

Ad slots are labeled with `Advertisement` text and descriptive positions (above-the-fold, in-article, sidebar) to keep
monetization transparent.
