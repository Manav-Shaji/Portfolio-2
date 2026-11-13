# Manav Shaji — Portfolio

A portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS v4, GSAP and Lenis.

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
├── app/
│   ├── api/contact/      # Contact form API route and tests
│   ├── apple-icon.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx
│   ├── opengraph-image.tsx
│   ├── page.test.tsx
│   └── page.tsx
├── components/
│   ├── effects/          # Background, cursor, scroll and reveal components
│   ├── sections/         # Portfolio sections and their component tests
│   └── ui/               # Navigation, command palette, socials and marquee
├── data/                 # Site, navigation, project and skill data
├── hooks/                # Media-query and motion-preference hooks
├── lib/                  # Contact validation and Lenis access
├── styles/               # Design tokens, base and component styles
└── test/setup.ts         # Shared Vitest setup
public/
└── README.md             # Instructions for adding the downloadable resume
```

The contact email has one source of truth in [`src/data/site.ts`](./src/data/site.ts); contact links and related UI read it from there.

## Adding a project

Add one object to [`src/data/projects.ts`](./src/data/projects.ts) with `name`, `type`, `summary` and `stack`. Add `href` only when the project has a real destination; cards without one are not links.

## Adding a skill

Add a group or update its items in [`src/data/skills.ts`](./src/data/skills.ts). The Skills section renders the data from that file.

## Resume

Resume links point to the current `public/Resume.pdf` file via `site.resumeUrl` in [`src/data/site.ts`](./src/data/site.ts). The URL must match the filename's capitalization. See [`public/README.md`](./public/README.md) for details.
