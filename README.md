# veridact.net

The veridact.net website: the Valet site, plus the Veridact and Veridact Valet documentation at
[veridact.net/docs](https://veridact.net/docs/). It is served by Cloudflare as static files.

| Path | What | Source of truth |
|---|---|---|
| `public/` (everything outside `/docs`) | The Valet site, as it is today | This repository |
| `/docs/introduction`, `/docs/changelog`, `/docs/guides/how-they-fit` | Hand-written docs pages | `src/content/docs/docs/` in this repository |
| Every other `/docs` page | The specifications and designs | Markdown in [veridactlabs/veridact](https://github.com/veridactlabs/veridact) and [veridactlabs/veridact-valet](https://github.com/veridactlabs/veridact-valet), listed in `docs.config.mjs` |

**Edit the docs in their own repositories, not here.** `npm run build` clones both repositories, converts the
markdown named in `docs.config.mjs` into pages, rewrites links between them to stay on the site, and fails if
a page names a company that must not appear publicly. A push to this repository deploys at once; changes in the
other two arrive at the daily rebuild, or within minutes with `contrib/notify-site.yml`.

## Work on it locally

```sh
npm ci
npm run dev        # http://localhost:4321/docs/
npm run build      # the full site in dist/
```

To preview docs from a local checkout instead of GitHub: `VERIDACT_LOCAL=../veridact VALET_LOCAL=../veridact-valet npm run dev`.
To build before the Valet site is in `public/`: `ALLOW_NO_HOME=1 npm run build`.

The docs are [Astro Starlight](https://starlight.astro.build/). Requirement keywords (MUST, SHOULD, MAY…) are
highlighted on pages with `bcp14: true`. Code blocks take captions: ` ```json title="Agent Credential" `.
Mermaid blocks render as diagrams. Every page also exists as plain markdown at the same path with `.md`, which
the **Copy page** button uses.

## Cost

| Item | Cost |
|---|---|
| Hosting on Cloudflare Workers (static assets) | Free. Static requests are free and unlimited on every plan |
| Builds | Free, on GitHub Actions (public repository) |
| Email forwarding (Cloudflare Email Routing) | Free |
| A large video in R2, if needed (step 6) | Free up to 10 GB stored, and R2 has no egress fees |
| Domain registration | Unchanged at Hetzner, or about US$12 a year at cost at Cloudflare Registrar (step 7) |

The Hetzner web hosting plan can be cancelled after the cutover.

## Moving veridact.net from Hetzner to Cloudflare

DNS is already on Cloudflare, so nothing changes at the registrar. Do the steps in order. **Email comes before the
website**, because cancelling Hetzner hosting would otherwise end the forwarding of hello@, security@ and conduct@.

### 1. Publish the v0.5 specification

Commit the new `docs/specification.md` (and the README update) to `veridactlabs/veridact`. The site builds from
the repository's `main` branch, so until then `/docs/veridact/spec` shows the v0.4 text.

### 2. Put the current site in `public/`

Copy the current veridact.net files from Hetzner into `public/`, keeping their paths: `public/index.html`,
`public/valet/…`, `public/media/…`, and so on. Then update the Valet page's links to the GitHub docs so they point
at the site:

| Old link | New link |
|---|---|
| `github.com/…/veridact-valet/blob/main/docs/where-valet-fits.md` | `/docs/valet/where-valet-fits/` |
| `…/docs/technical-design.md` | `/docs/valet/technical-design/` |
| `…/docs/threat-model.md` | `/docs/valet/threat-model/` |
| `…/docs/mcp-gateway-design.md` | `/docs/valet/mcp-gateway/` |
| `github.com/richard-craig/veridact-valet` | `github.com/veridactlabs/veridact-valet` |

Add a **Docs** link to the site's navigation, pointing at `/docs/`.

### 3. Connect GitHub to Cloudflare

1. In Cloudflare, **My Profile → API Tokens → Create Token**, template **Edit Cloudflare Workers**, limited to your account.
2. Copy your **Account ID** from the Workers & Pages overview.
3. In this repository on GitHub, **Settings → Secrets and variables → Actions**, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
4. Push to `main`. The workflow builds and deploys to `https://veridact-net.<your-subdomain>.workers.dev`. Check the
   site and the docs there. Nothing at veridact.net has changed yet.

### 4. Move email forwarding to Cloudflare Email Routing

1. In the veridact.net zone, **Email → Email Routing → Get started**.
2. Add your Gmail address as a destination and click the verification link Cloudflare sends.
3. Create routing rules for `hello@`, `security@` and `conduct@`, each forwarding to that address.
4. Let Cloudflare add its MX and SPF records, and remove the old Hetzner MX records when it asks.
5. Send a test message to each address from another account.

Email Routing receives and forwards only. If you send mail *as* hello@veridact.net through Hetzner's SMTP server,
that stops when Hetzner hosting is cancelled; use Gmail's "Send mail as" with another SMTP provider instead.

### 5. Point veridact.net at the Worker

1. In Cloudflare DNS, note and then delete the `A`/`AAAA`/`CNAME` records for `veridact.net` and `www` that point at
   Hetzner. Leave every other record alone, including those for the Valet demo's subdomains.
2. In `wrangler.jsonc`, uncomment `routes`, then push. Cloudflare creates the DNS records and the certificates.
3. Check `https://veridact.net/`, `https://veridact.net/valet/`, `https://veridact.net/docs/` and `https://www.veridact.net/`.

To roll back, delete the Worker's custom domains and restore the records you noted.

### 6. Check the video

Cloudflare serves files up to 25 MiB. If `public/media/valet-explainer.mp4` is larger, the build's deploy step
fails. Re-encode it smaller, or upload it to an R2 bucket with a custom domain such as `media.veridact.net` and
change the video's `src` to that URL.

### 7. Optional: move the registration

Moving the domain registration to Cloudflare Registrar costs only the registry's price (about US$12 a year for
.net), and adds a year to the registration. Unlock the domain and get its auth code from Hetzner, then start the
transfer under **Domain Registration → Transfer Domains**.

### 8. Cancel Hetzner hosting

Wait a week after step 5, confirm email still arrives, then cancel the Hetzner web hosting plan.

## Licence

Code: Apache License 2.0. Documentation pages are published from repositories under the same licence.
