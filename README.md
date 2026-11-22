# veridact.net

The veridact.net website: the Valet site, plus the Veridact and Veridact Valet documentation at
[veridact.net/docs](https://veridact.net/docs/). It is served by Cloudflare as static files.

| Path | What | Source of truth |
|---|---|---|
| `public/` (everything outside `/docs`) | The Valet site, as it is today | This repository |
| `/docs/introduction`, `/docs/changelog`, `/docs/guides/how-they-fit` | Hand-written docs pages | `src/content/docs/docs/` in this repository |
| Every other `/docs` page | The specifications and designs | Markdown in [veridactlabs/veridact](https://github.com/veridactlabs/veridact) and [veridactlabs/veridact-valet](https://github.com/veridactlabs/veridact-valet), listed in `docs.config.mjs` |

**Edit the docs in their own repositories, not here.** The build clones both repositories, converts the
markdown named in `docs.config.mjs` into pages, rewrites links between them to stay on the site, and fails if
a page names a company that must not appear publicly.

## How it deploys

Cloudflare builds and deploys this repository itself (Workers Builds, connected through Cloudflare's GitHub app),
so there are no deploy secrets in GitHub.

- **A push to `main`** builds the site and deploys it to the `veridact-net` Worker within a couple of minutes.
- **A pull request** is built by GitHub Actions (`ci.yml`) to check it still builds.
- **Docs changes in the other two repositories** are picked up by `docs-refresh.yml`, which runs hourly. When
  either repository's `main` has moved, it records the new commits in `docs-sources.json` and pushes, and that
  push triggers the Cloudflare build.

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
| Builds (Cloudflare Workers Builds, GitHub Actions) | Free tiers |
| Email forwarding (Cloudflare Email Routing) | Free |
| Domain registration | Unchanged at Hetzner, or about US$12 a year at cost at Cloudflare Registrar |

## Hosting history

Until 22 November 2026 the site was served from Hetzner web hosting. The live files were imported from there into
`public/` (the dated backup copies were left on Hetzner). DNS has been on Cloudflare since November 2026, with email
on Cloudflare Email Routing. veridact.net and www are proxied through Cloudflare, and Worker routes send all
traffic to the `veridact-net` Worker.

To roll back to Hetzner, remove the Worker's routes in the Cloudflare dashboard: the proxied DNS records still
point at the Hetzner server, which keeps serving the old site until that hosting is cancelled.

## Licence

Code: Apache License 2.0. Documentation pages are published from repositories under the same licence.
