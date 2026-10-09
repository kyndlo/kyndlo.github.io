# FiveOrbit Studio website

A static studio home for HiddenForm, Prism Lines, Kyndlo and Daily Spirit.
The project uses HTML, CSS and small JavaScript files; there is no npm install or framework build.

## Run locally

```sh
cd /Users/pirumpi/Reper/website
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/.

## Edit

- `studio.css`: shared responsive design.
- `data/apps.json`: app copy, authentic assets and verified store availability.
- `tools/build-site.py`: shared HTML templates. Run `python3 tools/build-site.py` after catalog or template changes; commit the generated HTML as well as the source templates.
- `tools/build-logo.py`: editable, font-independent SVG logo geometry. Run `python3 tools/build-logo.py` to regenerate all logo variants.
- `assets/brand/`: horizontal, stacked, mark-only and monochrome SVG logos, plus the social preview.
- `design/`: generated visual references and final browser previews.

Each product has `/<app>/` and `/<app>/download/`. Product pages stay browsable.
Download pages route iPhone/iPad (including desktop-mode iPad) to Apple and Android to Google Play when that platform is available. Computers and unknown devices retain store choices. Unavailable platforms are not redirected to another OS's store.

Kyndlo is currently Android open testing with iOS coming soon. Daily Spirit is coming soon. Update the catalog only after verifying new public store availability.

## Verify

```sh
python3 tests/verify-site.py
node tests/download-routing.test.cjs
node --check scripts/hiddenform-analytics.js
node --check scripts/download.js
git diff --check
```

The routing suite mocks navigation and analytics so its tests do not generate live traffic. Production HiddenForm consent, campaign propagation, Apple token and bounded navigation callbacks are preserved. Localhost previews do not load production Google Analytics. Analytics has not been expanded to the other apps.

## Hosting

GitHub Pages publishes this repository from `main` at the root. The primary custom domain is `fiveorbit.studio`, with `www` pointing to `kyndlo.github.io`. Cloudflare serves DNS-only records for GitHub Pages. The redesigned site and studio-wide analytics were published October 8, 2026.

New HiddenForm links use `/hiddenform/download/`, owned by this website, so they no longer depend on the separate support project's assets. The local legacy `/whim-and-wood-support/download/` page works too. In production that legacy path is owned by the separate `kyndlo/whim-and-wood-support` Pages project; changing this checkout alone does not replace that project's HTML. The shared analytics script retains portable styles for compatibility with it. See `docs/HIDDENFORM_ANALYTICS.md`.

Source and validation details: `docs/ASSET_SOURCES.md` and `design/REVIEW.md`.

Studio-wide analytics setup and reporting fields: [docs/FIVEORBIT_ANALYTICS.md](docs/FIVEORBIT_ANALYTICS.md).
