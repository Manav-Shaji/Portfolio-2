# Manav Shaji — Portfolio

A portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS v4, GSAP and Lenis.

## Setup

Use Node.js with npm, then install dependencies and start the development server:

```bash
npm install
npm run dev
```

Configure `.env` before running the app if you want contact-form delivery. Open [http://localhost:3000](http://localhost:3000). The site can run without Gmail credentials, but contact-form delivery remains unavailable until they are configured.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest |
| `npm run test:watch` | Run Vitest in watch mode |

## Contact email setup

The existing `/api/contact` route sends enquiries through Gmail SMTP using Nodemailer. Automated tests mock Nodemailer and never send email.

### Create a Gmail App Password

1. Enable 2-Step Verification on the Google Account you intend to use for SMTP.
2. Open **Google Account → Security → 2-Step Verification → App passwords** and create an app password.
3. Use that app password only. Do not use your normal Gmail password or commit the app password.

If App passwords are not available for the account, review Google's account or organization restrictions; do not substitute the normal account password.

### Configure local development

Create or update `.env` in the repository root with:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GMAIL_USER=your-account@gmail.com
GMAIL_APP_PASSWORD=<YOUR_GMAIL_APP_PASSWORD>
CONTACT_EMAIL=your-recipient@example.com
```

Replace the sample addresses and password placeholder with your own values. `GMAIL_USER` must be the Gmail account that generated the App Password. `.env` is gitignored. Keep `GMAIL_APP_PASSWORD` server-side and never add a `NEXT_PUBLIC_` prefix to Gmail credentials. After editing the file, restart the Next.js development server, open [http://localhost:3000](http://localhost:3000), and submit a test enquiry. Confirm that it arrives at the configured recipient; then reply to the message and verify the reply is addressed to the visitor, whose address is set as `Reply-To`.

The route validates input, enforces the hidden `company_url` honeypot and per-instance rate limit, limits request size, escapes HTML content, and uses SMTP connection/greeting/socket timeouts. Its errors do not reveal provider details or credentials.

### Configure Vercel production variables

In **Vercel → Portfolio-2 → Settings → Environment Variables**, add these values to the Production environment (and Preview/Development if needed):

```dotenv
NEXT_PUBLIC_SITE_URL=https://your-domain.example
GMAIL_USER=your-account@gmail.com
GMAIL_APP_PASSWORD=<YOUR_GMAIL_APP_PASSWORD>
CONTACT_EMAIL=your-recipient@example.com
```

Replace the sample domain and email addresses with your production values. Save the variables and trigger a new deployment; changing environment variables does not update an already-built deployment. Do not paste the app password into source control, support messages, or client-side variables.

### Troubleshooting

- Check the Vercel function logs for the SMTP error code or timeout kind. The route does not log the message body, email addresses, or credentials.
- Confirm `GMAIL_USER` is the account that generated the App Password, and that `GMAIL_APP_PASSWORD` is an App Password rather than the normal account password.
- Confirm the App Password has no accidental truncation and the recipient is a valid address.
- Check Gmail’s Sent folder, spam/junk, account security alerts, and Google Workspace/admin restrictions.
- A `429` response means the per-instance rate limit was reached; wait for its window to pass. In-memory rate limiting is best-effort across multiple Vercel instances.
- After changing Vercel variables, redeploy before retesting.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL used for metadata (defaults to `http://localhost:3000`) |
| `GMAIL_USER` | Yes, for delivery | Gmail SMTP account used as the From address; server-side only |
| `GMAIL_APP_PASSWORD` | Yes, for delivery | Google App Password for SMTP authentication; never expose it to client code |
| `CONTACT_EMAIL` | Yes, for delivery | Valid recipient inbox for portfolio messages |

`.env` is gitignored; do not commit it or real credentials.

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
