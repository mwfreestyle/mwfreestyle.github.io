# MWFC site

Website of the Mount Washington Freestyle Club.
Live: https://mwfreestyle.com

Built with Eleventy 3. Source in `src/`, output in `_site/`.

## Commands

    npm install
    npm run serve    dev server at http://localhost:8080
    npm run build    build to _site/

## Deploy

Push to `main`. GitHub Actions builds the site and publishes
it to GitHub Pages.

## Editing

* Data and config (all JSON): `src/_data/`
* Programs: `src/programs/<slug>.md`
* Page text: `src/content/*.md`

Hosting, DNS, accounts and how the site is built:
[docs/SETUP.md](docs/SETUP.md)

Logins are in the club Bitwarden. Never commit secrets.
