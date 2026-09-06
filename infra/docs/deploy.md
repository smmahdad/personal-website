# sammah.dad production deploy

Same **process** as karajournal / tide: push **`main`**, then on **penisland2** git-pull and `docker compose up -d --build`.

```
push origin/main
  → penisland2: git pull --ff-only origin/main
  → docker compose up -d --build
  → nginx :8082
  → penisland Apache TLS for https://sammah.dad
```

Static Next.js export inside one nginx container. No `.env`, no database.

Apache on penisland is one-time edge config; it is not rebuilt on app deploys.

## Everyday

1. Merge/commit to **`main`** and push `smmahdad/personal-website`.
2. From the laptop:

```bash
bash infra/scripts/remote-pull-up.sh
```

Or SSH in:

```bash
ssh sam_user@penisland2
cd ~/workspace/personal-website
bash infra/scripts/server-compose-up.sh
```

Status / logs:

```bash
bash infra/scripts/remote-compose.sh ps
bash infra/scripts/remote-compose.sh logs -f web
```

## One-time: Apache + TLS on penisland

After DNS points at the house IP (see Squarespace below):

```bash
ssh sam@penisland
cd ~/workspace/personal-website   # or clone this public repo there
bash infra/scripts/enable-apache.sh
```

That script needs a sudo password. It enables the HTTP vhost, reloads Apache, then runs certbot for `sammah.dad` + `www.sammah.dad`.

## Squarespace DNS

Keep Squarespace as the registrar / DNS host. Do **not** move nameservers.

In Squarespace → **Domains** → **sammah.dad** → **DNS Settings**:

1. Turn off **domain forwarding** / the Squarespace website connection so custom records win.
2. Delete the Squarespace parking records:
   - A records to `198.185.159.144`, `198.185.159.145`, `198.49.23.144`, `198.49.23.145`
   - CNAME `www` → `ext-sq.squarespace.com`
3. Add:

   | Type | Host | Data | TTL |
   | --- | --- | --- | --- |
   | A | `@` | `67.243.35.252` | 30 min (raise later) |
   | A | `www` | `67.243.35.252` | 30 min |

4. Leave MX / email records alone if you add mail later.
5. Wait until `dig +short sammah.dad A` returns `67.243.35.252`, then run `enable-apache.sh`.

Same A record as `karajournal.com` and `mah.dad`. Do not Cloudflare-proxy this name (Let's Encrypt HTTP-01 talks to penisland Apache on :80).

## Gotchas

- `git pull --ff-only` refuses if the server checkout has local commits. Don’t commit on penisland2.
- TLS is on penisland Apache, not in Compose. nginx here is HTTP on **8082**.
- Leave `NEXT_PUBLIC_BASE_PATH` unset for the apex domain.
