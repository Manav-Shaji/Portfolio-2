# Manav Shaji — Portfolio

A portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS v4, GSAP, Motion and Lenis.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set the Resend values in `.env.local` to enable contact-form delivery.

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

## Environment

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes, for delivery | Resend API key used by `/api/contact` |
| `RESEND_FROM_EMAIL` | Yes, for delivery | Sender address on a domain verified with Resend |
| `CONTACT_EMAIL` | Yes, for delivery | Inbox that receives portfolio messages |

The contact route validates submissions, checks a honeypot field and sends messages through Resend. If these variables are not configured, it returns a service-unavailable response.

## Project structure

```text
src/
├── app/                 # App Router layout, page, metadata and API routes
├── components/
│   ├── effects/         # Background, cursor, scroll and reveal behavior
│   ├── sections/       # Hero, About, Work, Skills, Contact and Footer
│   └── ui/             # Navigation, command palette, socials and marquee
├── data/               # Site, navigation, project and skill content
├── styles/             # Tokens, base and feature styles
└── test/               # Shared test setup
public/
└── README.md           # Notes about the optional resume PDF
```

## Adding a project

Add one object to `src/data/projects.ts` with its name, type, summary and stack. The Work section renders that data automatically; no component edit is needed.
