# sammah.dad

Personal site for [Sam Mahdad](https://sammah.dad). First-person, public facts only, edited from `src/content/`.

Hosted like karajournal: Docker on penisland2, TLS on penisland Apache. DNS still lives at Squarespace until cutover (see [infra/docs/deploy.md](infra/docs/deploy.md)).

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test          # content integrity
npm run lint
npm run build     # static export into ./out
npm run preview   # serve the export
```

Node 22+ recommended.

## Stack

- Next.js App Router (static export)
- TypeScript
- Tailwind CSS v4
- Editable TypeScript content modules in `src/content/`

No CMS. No secrets. No server runtime required.

## Edit the copy

All biographical and work copy lives in:

| File | What it is |
| --- | --- |
| `src/content/site.ts` | Name, domain, current role, nav, GitHub / LinkedIn / email |
| `src/content/home.ts` | Hero, now/before cards, featured stat, closing line |
| `src/content/about.ts` | Short personal lines and asides |
| `src/content/work.ts` | Cursor, Rippling, Amazon stories + latency graphic numbers |
| `src/content/writing.ts` | Public posts |
| `src/content/contact.ts` | Contact intro and channels |

Comments at the top of those files mark uncertain dates and placeholders. Do not invent employers, awards, or start dates.

To add email later, set `site.links.email` in `src/content/site.ts`. The contact page will pick it up.

To add a post, append an object to `writing`.

## Deploy

Production is the house stack (same path as karajournal / tide):

```
Browser → sammah.dad → 67.243.35.252
  → penisland Apache (TLS)
  → penisland2 nginx :8082 (this repo, static export)
```

Push `main`, then:

```bash
bash infra/scripts/remote-pull-up.sh
```

Full Apache / certbot / Squarespace steps: [infra/docs/deploy.md](infra/docs/deploy.md).

The build is a static export (`output: "export"`). No environment variables. Leave `NEXT_PUBLIC_BASE_PATH` unset for the apex domain.

### Squarespace (registrar)

Keep Squarespace DNS. Point A records at the house IP, then we can finish TLS:

| Type | Host | Data |
| --- | --- | --- |
| A | `@` | `67.243.35.252` |
| A | `www` | `67.243.35.252` |

Delete the current Squarespace parking A/CNAME records (`198.185.159.*`, `ext-sq.squarespace.com`) and turn off domain forwarding. Details in the deploy doc.

### GitHub Pages (optional fallback)

A workflow lives at `.github/workflows/pages.yml`. Do not put the apex domain on Pages while Apache is serving it.

## Design notes

Warm dark page, Fraunces + IBM Plex, brass on ink. The latency ruler on Home and Work is the Spend authorization budget: ~3.5s p99 → ~600ms against a ~4s decline.

## Facts policy

Copy is based on public LinkedIn, the Rippling Engineering blog post, the Grok Bot Product Hunt launch, and public posts. Soft on Cursor title/date. No private product detail.
