# Newflow Partners

Corporate website for Newflow Partners, a deal sourcing and advisory firm founded by former private equity professionals. The firm connects exceptional businesses with private capital partners and provides proprietary deal sourcing for leading PE firms.

## Overview

- **For Business Owners** -- Confidential, no-cost advisory services for owners exploring sales, partnerships, or valuations
- **For Private Equity** -- Proprietary deal sourcing from thesis refinement through close, operating as an extension of your deal team
- **About Us** -- Leadership team, company values, and the story behind Newflow Partners

## Tech Stack

- React (single-page application)
- Vite (build tool and dev server)
- Cloudflare Pages (hosting and deployment)
- Cloudflare Pages Functions (serverless contact form API)
- Mailgun (transactional email delivery)

## Development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Build

```bash
npm run build
```

Output is generated in the `dist` directory.

## Deployment

The site deploys automatically to Cloudflare Pages from the `master` branch. The contact form function at `functions/api/contact.js` runs as a Cloudflare Pages Function.

### Environment Variables (Cloudflare Pages)

The following environment variables must be configured in the Cloudflare Pages dashboard:

| Variable | Description |
|---|---|
| `MAILGUN_API_KEY` | Mailgun API key for sending contact form emails |
| `MAILGUN_DOMAIN` | Mailgun sending domain (defaults to `newflowpartners.com`) |
| `RECIPIENT_EMAIL` | Contact form recipient (defaults to `Info@NewflowPartners.com`) |

## Project Structure

```
src/
  App.jsx          -- Main application (all pages, styles, and data)
  main.jsx         -- Entry point
functions/
  api/
    contact.js     -- Cloudflare Pages Function for contact form
public/
  images/          -- All site images and assets
  fonts/           -- Custom typefaces
```
