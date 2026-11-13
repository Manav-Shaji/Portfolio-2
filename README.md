# Manav Shaji — Portfolio

A portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS v4, GSAP, Motion and Lenis.

## Setup

Use Node.js with npm, then install dependencies and start the development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site can run without Resend credentials, but contact-form delivery remains unavailable until they are configured in `.env.local`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run e2e` | Run Playwright end-to-end tests |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL used for metadata (defaults to `http://localhost:3000`) |
| `RESEND_API_KEY` | Yes, for delivery | Resend API key used by `/api/contact` |
| `RESEND_FROM_EMAIL` | Yes, for delivery | Sender address on a domain verified with Resend |
| `CONTACT_EMAIL` | Yes, for delivery | Inbox that receives portfolio messages |

The contact route validates submissions, checks a honeypot field and sends messages through Resend. Without the three Resend/contact variables, it returns a service-unavailable response. Start from `.env.example`; do not commit `.env.local` or real credentials.

## Project structure

```text
src/
├── app/                  # App Router page, layout, metadata, global CSS and API routes
├── components/
│   ├── effects/          # Background, cursor, scroll and reveal behavior
│   ├── sections/         # Hero, About, Work, Skills, Contact and Footer
│   └── ui/               # Navigation, command palette, socials and marquee
├── data/                 # Site, navigation, project and skill content
├── hooks/                # Media-query and motion-preference hooks
├── styles/               # Design tokens, base and feature styles
└── test/                 # Shared Vitest setup
public/
└── README.md             # Instructions for adding the downloadable resume
```

## Adding a project

Add one object to [`src/data/projects.ts`](./src/data/projects.ts) with `name`, `type`, `summary` and `stack`. The Work section renders that data automatically; no component edit is needed.

## Adding a skill

Add a group or update its items in [`src/data/skills.ts`](./src/data/skills.ts). The Skills section renders the data from that file.

## Resume

Add the PDF at `public/resume.pdf` to enable the download links in the navigation and Contact section. See [`public/README.md`](./public/README.md) for details.
