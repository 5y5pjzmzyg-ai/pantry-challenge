# Verification — 19 October 2026

## Automated tests

Nine Node.js tests pass: independent quantities preserved by moves; custom units and approximate amounts; invalid values/dates rejected; backup roundtrip and duplicate IDs; date reminders independent of Use It Up; receipt parsing without commit; accent-insensitive search; supplements/medicines optional-date behavior; markup-bearing IDs rejected.

## Browser checks completed in the desktop in-app browser

- Added a product with 2 unopened + 1 opened and About half; tagged Use It Up.
- Moved it from Tampere/Cupboard to Seinäjoki/Supplements; all quantities and its tag stayed unchanged.
- Added it to Shopping and verified the stock breakdown was shown.
- Parsed a receipt, attempted commit without reviewing, and observed the blocking review message. Checked both proposed items, changed one category to Fridge, and saved the two products in one batch.
- Recognized a synthetic English receipt image using the bundled local OCR worker. Output contained Milk, Oregano, Rice and their prices.
- Stopped the HTTP server entirely, reloaded the app from the service worker, and verified all three saved products were still present.
- With the server still stopped, ran the same photo through the Finnish model successfully; the full local OCR engine and previously unused Finnish model worked from the offline cache.
- Exported a real backup, selected it for import, verified the per-home counts and replacement confirmation, restored it, and verified product stock remained present.
- No console errors/warnings were observed during the OCR check.

## Limits

Physical iPhone/Safari installation and its storage-permission behavior have not been tested. The layout has a mobile breakpoint, large touch targets and a PWA manifest, but final Safari device verification should cover Add to Home Screen, a cold offline launch, photo selection and export to Files. Browser storage can be evicted; exported backups are the recovery path. Real receipt formatting varies, which is why per-product review is mandatory.

## Quantity controls update

Twelve model tests pass, including whole-count validation, fractional stock and legacy-backup migration. Browser checks saved 12 eggs and 2.5 cartons, verified custom units and optional independent split quantities, and confirmed receipt review uses the same controls.

## iPhone focus and tapping fix

Browser-computed font sizes for search, sort, and every add-item input/select/textarea are 16px. Opening the form focuses its type selector and no longer autofocuses a text field. Pinch zoom remains enabled; touch manipulation suppresses double-tap zoom, smaller mobile controls have 44px targets, and the dialog scrolls inside the available viewport. Physical iPhone keyboard/zoom behavior still needs device confirmation.

## Tile inventory update

Browser checks opened Fridge from a tile, added 12 eggs with Fridge preselected, edited it to 10 eggs through the simple list, and returned to the correct category product count. Search retained focus while filtering without replacing the focused field. All editor inputs/selects/textareas computed to 16px, with no autofocus. The app now uses category tiles instead of the old inventory hero and chip filters. Physical iPhone testing remains a device-side check.
