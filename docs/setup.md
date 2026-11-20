# MWFC site setup

Eleventy static site. Input `src/`, output `_site/`.

## Commands

    npm run serve    dev server, http://localhost:8080
    npm run build    build to _site/

Deploy: push to `main`. GitHub Actions builds and publishes.

## Hosting

* Live site: https://mwfreestyle.com
* Host: GitHub Pages (free), built by Actions
* GitHub org: `mwfreestyle`
* Repo: `mwfreestyle/mwfc-site`
* Workflow: `.github/workflows/pages.yml` (Node 22)
* Pages source: repo Settings > Pages > GitHub Actions
* Custom domain: set in repo Settings > Pages (one at a time)
* Default address: mwfreestyle.github.io
* Old host: SiteGround, A record 35.215.123.236. Kept only
  for rollback.

## DNS (mwfreestyle.com)

Registrar and DNS: GoDaddy

* `@`    A      185.199.108.153, .109.153, .110.153, .111.153
* `www`  CNAME  mwfreestyle.github.io
* `_github-pages-challenge-mwfreestyle`  TXT  (GitHub code)
  Verified 2026-11-19. Never delete it, or the domain loses
  its verified status.

HTTPS: GitHub issues the certificate (Let's Encrypt) and
renews it.

After changing the custom domain, push an empty commit to
redeploy. This clears a cached 404:

    git commit --allow-empty -m "Redeploy" && git push

## Accounts

Logins and recovery codes are in the Bitwarden org MWFC.
Nothing secret goes in the repo.

* Club email: mwfc.webmaster@gmail.com
* GitHub (club): `mwfc-webmaster`
* Org owners: `mwfc-webmaster`, `thenewuss`
* Pushes: SSH key on the personal account

## Moving to another host

    npm run build

Upload `_site/` to any host, then change the DNS records.
Change DNS first, then remove the custom domain or the repo.
A domain still pointing at GitHub with no repo claiming it
can be taken over.

## Folders in src/

| Folder       | Role                                        |
|--------------|---------------------------------------------|
| `_data/`     | JSON/JS data, global in every template      |
| `_includes/` | Layouts and partials. Never builds pages.   |
| `pages/`     | Hand-made pages (`.njk`, `.md`)             |
| `programs/`  | One `.md` per program, built at `/slug/`    |
| `content/`   | Prose only, pulled in. Not built.           |
| `css js img fonts files` | Copied as is                    |

`content/content.json` sets `permalink: false` so nothing in
`content/` becomes a page.

## Program data flow

    programs.json -> programList.js -> `programList` global

* `programs.json`: `_defaults`, `_fragments`, one entry per
  program. Every program needs a `type`.
* `programList.js`: merges `_defaults` into each program, adds
  `slug` (key in kebab-case), throws if `src/programs/<slug>.md`
  is missing.

Types: `fullSeason`, `camp`, `dryland`.

## Detail pages (src/programs/)

Front matter is only `program: key`. `programs.11tydata.js`
adds layout `program.njk`, `p`, title, description, and the
permalink `/slug/`. The body text is the page prose.

`program.njk` renders `p`. Entries in `requirements`, `included`
and `notes` go through the `note` filter: a `_fragments` key or
literal text, with `{{ p.field }}` filled in.

## Listing pages (src/pages/)

`full-season.njk` and `camps.njk` loop `programList`, filter by
`type`, and show cards linking to `/slug/`. Their intro prose
comes from `src/content/*.md` via the `markdownFile` filter.
Paths are from the project root: `src/content/camps.md`.

`dryland` (trampoline) has no listing page. The nav links
straight to it.

## Add a program

1. Add an entry to `programs.json` (with `type`).
2. Create `src/programs/<slug>.md` with `program: key`.
3. Listing page picks it up by `type`.

## Shell

* `base.njk` wraps every page: nav, sponsor band, footer.
* `nav.json` and `footerNav.json` drive the menus.
* Markdown `[](email:info)` becomes a reversed-address link,
  using `site.json`.
* Shortcodes: `snowregButton`, `socialLink`. Filter: `dateRange`.
