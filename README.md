# sammah.dad

Personal site for [Sam Mahdad](https://sammah.dad). First-person, public facts only, edited from `src/content/`.

The domain currently redirects from Squarespace. This repo is the replacement. DNS cutover comes later.

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
| `src/content/home.ts` | Hero, now/before strip, closing line |
| `src/content/about.ts` | Personal essay and asides |
| `src/content/work.ts` | Cursor, Rippling, Amazon stories + latency graphic numbers |
| `src/content/writing.ts` | Public posts |

Comments at the top of those files mark uncertain dates and placeholders. Do not invent employers, awards, or start dates.

To add email later, set `site.links.email` in `src/content/site.ts`. The contact page will pick it up.

To add a post, append an object to `writing`.

## Deploy

The build is a static export (`output: "export"`). `./out` can go to GitHub Pages, Vercel, or any static host.

### Vercel (simplest for this repo)

1. Import [smmahdad/personal-website](https://github.com/smmahdad/personal-website).
2. Framework preset: Next.js. Build command `npm run build`. Output `out` is produced automatically; Vercel understands `output: "export"`.
3. After the Squarespace redirect is retired, add `sammah.dad` and `www.sammah.dad` in Vercel → Domains.
4. Point the domain registrar at Vercel’s nameservers or add the A / CNAME records Vercel shows.

No environment variables are required for production on the apex domain.

### GitHub Pages

A workflow lives at `.github/workflows/pages.yml`.

1. Repo Settings → Pages → Source: **GitHub Actions**.
2. Push to `main` (or run the workflow manually).
3. For the apex domain later: Settings → Pages → Custom domain → `sammah.dad`, then add the DNS records GitHub shows. Do **not** add a `CNAME` file or change DNS while Squarespace still owns the redirect, unless you are ready to cut over.
4. If you ever serve this as `https://smmahdad.github.io/personal-website/` without a custom domain, build with:

   ```bash
   NEXT_PUBLIC_BASE_PATH=/personal-website npm run build
   ```

   `next.config.ts` reads that env var. Apex `sammah.dad` should leave it unset.

### After DNS cutover

- Keep Squarespace’s redirect only until the new host answers HTTPS on `sammah.dad`.
- Add `www` or not — the site does not assume a www host.
- Set a mailbox later if you want `hello@sammah.dad`; the content file is already wired for it.

## Design notes

Warm dark page, Fraunces + IBM Plex, brass on ink. The latency ruler on Home and Work is the Spend authorization budget: ~3.5s p99 → ~600ms against a ~4s decline.

## Facts policy

Copy is based on public LinkedIn, the Rippling Engineering blog post, and public posts. Soft on Cursor title/date. No private product detail.
