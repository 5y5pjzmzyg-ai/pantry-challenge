# Pantry Challenge

A one-user, mobile-first, installable web app. No account or server database is needed. The connected GitHub account is for source code and deployment, never for storing inventory.

## Run

With Node.js 20 or newer:

```
npm start
```

Open http://127.0.0.1:4173. The static site is in `dist/`. For a phone, deploy `dist/` on an HTTPS static host; localhost on your computer is not localhost on your phone. Do not open index.html directly. HTTPS (or localhost) is required for offline caching, installation and receipt recognition workers.

## Features

- Separate Tampere and Seinäjoki inventories and shopping lists.
- Seven categories: Fridge, Freezer, Cupboard, Household, Toiletries, Supplements, Medicines.
- Independently editable decimal opened/unopened quantities; custom units and optional rough amounts. Different container units may be separate product rows.
- Explicit whole-row moves across homes/categories. Moving never opens containers. Partial moves can be recorded by editing the source and adding the destination stock.
- Optional Reminder, Best before and Use by dates. Undated fridge/freezer/cupboard stock receives check prompts after 7/90/180 days. These are reminders to inspect, not expiry estimates. No automatic date timer for household, toiletries, supplements or medicines.
- Intentional Use It Up tags and remaining product count, separate from date status.
- Shopping lists accept free text or inventory items, with accent-insensitive stock lookup across both homes. Checking bought does not alter stock.
- Local Finnish/English receipt photo OCR using bundled Tesseract. A text fallback is available. OCR lines are proposals, all destinations and quantities are editable, and each included product requires review before the atomic batch commit. Same-name rows are never silently merged.
- IndexedDB atomic storage, cross-tab transaction serialization, last-change recovery and validated JSON backup import/export.
- Installable PWA with all code, OCR engine and languages cached locally. Offline setup downloads about 30 MB once.

## Data and privacy

Inventory lives only in this browser profile, per site address. It is not encrypted by the app, does not sync across devices and is not recoverable from GitHub. Use a locked device/browser profile. Export backups regularly, especially before switching devices or deployment URL; backups are unencrypted JSON. Restoring a backup replaces both homes and shopping lists after a confirmation showing its contents. The previous state is kept for Undo.

No analytics, external fonts, third-party runtime calls or receipt uploads. A restrictive Content Security Policy permits only this origin and local image blobs. OCR code and language data are bundled, not fetched from a CDN at runtime. Storage failures are surfaced and do not update the in-memory inventory as if saving succeeded. A malformed database is not silently reset.

The service worker installs the entire shell atomically and retains the previous shell until an update activates after existing app tabs close. For a release that changes assets, change the CACHE version in dist/sw.js. After updates, close existing tabs and reopen. Browser storage eviction remains possible; persistent-storage permission is browser-dependent.

## Test

```
npm test
```

Tests use the built-in Node test runner, with no installed dependencies. Browser verification performed during development is recorded in VERIFICATION.md.

## Deployment

Serve dist/ over HTTPS without rewriting missing assets to HTML. Serve .mjs/.js as JavaScript, .wasm as application/wasm and .gz as application/gzip (do not set Content-Encoding: gzip on traineddata.gz). The included _headers file is supported by compatible static hosts. Other hosts should apply equivalent headers. Do not cache sw.js permanently. Keep the app at the same URL to keep using its existing browser storage.

Source repository: https://github.com/5y5pjzmzyg-ai/pantry-challenge

The app is published using GitHub Pages from the `gh-pages` branch, whose root contains the contents of `dist/`. The source and tests remain on `main`. All URLs are relative, so the app works at its repository subpath. The published app and source code are public; inventory, shopping data and receipt photos remain local to each browser.

For releases, publish the exact tested `dist/` contents to `gh-pages` and keep `.nojekyll` in that branch. No build or secrets are required.

When moving from a different site address, export a backup there and import it at the Pages address. Browser storage does not move automatically.

## Third-party code

Tesseract.js 5.1.1 and tesseract.js-core 5.1.1 are Apache-2.0 licensed. Language models are from the Tesseract tessdata project (Apache-2.0). See dist/vendor/LICENSE-tesseract.txt and THIRD_PARTY.md. All app code is plain browser JavaScript; no package installation or build is required.
