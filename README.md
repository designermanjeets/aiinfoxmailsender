# Aiinfox Mail Sender & Omnisend Backend

Backend service for Aiinfox that handles contact form email delivery and Omnisend REST API integration.

**Production URL:** `https://aiinfoxmailsendervercel.vercel.app`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 4.21.1 |
| Email | Nodemailer (Gmail SMTP) |
| HTTP Client | Axios 1.7.9 |
| Deployment | Vercel (serverless) |

## Project Structure

```
index.js              # Express server, CORS, email route, Omnisend route mount
omnisend.service.js   # Axios wrapper for Omnisend v3 REST API
omnisend.routes.js    # Express routes at /v1/omnisend/*
vercel.json           # Vercel deployment config
package.json          # Dependencies
```

## API Endpoints

### Email

| Method | Endpoint | Body | Purpose |
|--------|----------|------|---------|
| POST | `/v1/send-email` | `{ recipient, subject, text }` | Send email via Gmail SMTP |

### Omnisend Contacts

| Method | Endpoint | Body / Query | Purpose |
|--------|----------|-------------|---------|
| POST | `/v1/omnisend/contacts` | `{ email, firstName?, lastName?, phone?, tags? }` | Create or update a contact |
| GET | `/v1/omnisend/contacts?email=` | query: `email` | Look up a contact by email |

### Omnisend Events

| Method | Endpoint | Body | Purpose |
|--------|----------|------|---------|
| POST | `/v1/omnisend/events` | `{ email, eventName, fields? }` | Track a named event for a contact |

**Note:** Omnisend REST API uses `systemName` (not `eventName`) internally. The service maps `eventName` from the request body to `systemName` in the Omnisend payload.

### Omnisend Products

| Method | Endpoint | Body | Purpose |
|--------|----------|------|---------|
| POST | `/v1/omnisend/products` | Omnisend product schema | Sync a product |
| GET | `/v1/omnisend/products` | -- | List all products |
| GET | `/v1/omnisend/products/:id` | -- | Get a product by ID |
| DELETE | `/v1/omnisend/products/:id` | -- | Delete a product |

### Omnisend Categories

| Method | Endpoint | Body | Purpose |
|--------|----------|------|---------|
| POST | `/v1/omnisend/categories` | `{ categoryID, title }` | Create a category |
| GET | `/v1/omnisend/categories` | -- | List all categories |
| DELETE | `/v1/omnisend/categories/:id` | -- | Delete a category |

## How Omnisend Integration Works

This backend is **Phase 2** of the Aiinfox Omnisend integration:

- **Phase 1 (Frontend JS SDK)** -- runs in the browser on `aiinfox.com`, handles contact identification via `omnisend.identifyContact()` and tracks 10 custom marketing events (servicePageViewed, caseStudyViewed, productPageViewed, etc.) via `omnisend.push(["track", ...])`.
- **Phase 2 (This backend)** -- sends data directly to Omnisend's v3 REST API with an explicit email address. Doesn't depend on a browser session.

### Contact creation flow

When a user submits a form on `aiinfox.com`:
1. Frontend calls `omnisend.identifyContact({ email, phone })` via JS SDK (browser-side)
2. Frontend sends form data to this backend's `/v1/send-email` for email delivery
3. Backend can also call `/v1/omnisend/contacts` to create/update the contact server-side via REST API

### Event payload format

The service sends events to Omnisend as:
```json
{
  "email": "contact@example.com",
  "systemName": "eventName",
  "fields": { "key": "value" }
}
```

Events are sent to `POST https://api.omnisend.com/v3/events`. A `204` response means the event was accepted. A `400` response usually means the contact hasn't been created yet.

## CORS

Allowed origins:
- `https://aiinfox.com`
- `https://aiinfoxtech.com`
- `https://www.aiinfoxtech.com`
- `https://aiinfoxtech-livid.vercel.app`
- `https://www.gajaro.com`
- `https://www.gajmailbox.com`
- `http://localhost:4200`
- `http://localhost:5173`

Requests with no origin (curl, mobile apps) are allowed.

**Note:** Your Aiinfox mailer server's CORS config currently allows localhost:5173. You'll need to add your production domain (e.g., https://www.gajaro.com and https://www.gajmailbox.com) to the allowedOrigins array on the server for production to work.

## Environment Variables

Set these in Vercel project settings (or `.env` for local dev):

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default: 8080) |
| `SMTP_SERVICE` | Email service (Gmail) |
| `SMTP_HOST` | SMTP host (smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (587) |
| `SMTP_MAIL` | Gmail address |
| `SMTP_PASS` | Gmail app password |
| `OMNISEND_API_KEY` | Omnisend REST API key (v3) |

**Important:** Never commit `.env` to version control. Use Vercel environment variables for production.

## Local Development

```bash
npm install
npm start          # Starts with nodemon on port 8080
```

## Deployment

Deployed to Vercel as a serverless function. All routes are handled by `index.js`.

```bash
vercel --prod      # Deploy to production
```

## Omnisend API Reference

- [Omnisend v3 API Docs](https://api-docs.omnisend.com/v3/reference)
- [Custom Events](https://api-docs.omnisend.com/docs/how-to-send-custom-events-to-trigger-custom-automations)
- [Contacts API](https://api-docs.omnisend.com/v3/reference/get-contacts)
- [Events API](https://api-docs.omnisend.com/v3/reference/events)

## Related Projects

- **aiinfox** (frontend) -- Angular 17 SSR app at `aiinfox.com`, contains the JS SDK integration and all 10 custom marketing events
