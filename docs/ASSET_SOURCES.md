# Asset and availability sources

Verified October 8, 2026 (America/Denver).

## Inventory

Read the user's existing signed-in App Store Connect and Google Play Console tabs without changing either account.

| Product | Apple console | Google console | Website presentation |
|---|---|---|---|
| HiddenForm | 1.0.3 Ready for Distribution, ID 6809650487 | Production, com.whimandwood.puzzle.android | Both stores |
| Prism Lines | 1.3 Ready for Distribution, ID 6802463384 | Production, com.kyndlo.prismlines | Both stores |
| Kyndlo | 1.0.9 Waiting for Review, ID 6759362309 | Open testing, com.kyndlo.app | Android open testing; iOS coming soon |
| Daily Spirit: Oracle & Puzzle | 1.0 Prepare for Submission, ID 6815262538 | No app in the account list | Coming soon |

HiddenForm and Prism Lines public Apple listings and Android listings were verified in Chrome. Kyndlo's Apple URL showed that the page could not be found; its Google Play page showed the app. Open testing can depend on the visitor's account and region. No public download URL is fabricated for Daily Spirit.

Public sources:
- https://apps.apple.com/us/app/hiddenform/id6809650487
- https://apps.apple.com/us/app/prism-lines/id6802463384
- https://play.google.com/store/apps/details?id=com.whimandwood.puzzle.android
- https://play.google.com/store/apps/details?id=com.kyndlo.prismlines
- https://play.google.com/store/apps/details?id=com.kyndlo.app

Copy is concise original website copy informed by these product listings. Daily Spirit's features were checked against its App Store Connect description: intention, gesture-selected card, jigsaw, meaning and private journal.

## Real app icons

The icons were located in rendered App Store Connect app-list UI and downloaded from the public Apple image CDN. These are the actual uploaded product icons, not generated substitutes.

- HiddenForm: `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/34/e8/76/34e87686-6b27-29f5-ee9c-3eefa42941fb/Placeholder.mill/360x360bb.png`
- Prism Lines: `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/08/b0/ef/08b0efa8-80b1-4e95-aae8-b991221482de/Placeholder.mill/360x360bb.png`
- Kyndlo: `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/40/e7/e2/40e7e28d-6e1c-d8a3-397a-f639dffff3ee/Placeholder.mill/360x360bb.png`
- Daily Spirit: `https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f3/4b/4d/f34b4dc1-c03a-186a-df4b-56f2989a52fb/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/360x360ia.png`

Original PNGs and optimized WebP derivatives are under `assets/apps/`.

## Screenshots

- HiddenForm: user-provided `Screenshot 2026-09-27 at 12.03.15 PM.png`; 1320×2868. Original UI title says Wooden Wonders. Apple's HiddenForm release notes confirm the prior game branding changed. The screenshot's loading overlay is preserved.
- Prism Lines: user-provided `Screenshot 2026-09-28 at 10.32.01 PM.png`; 1320×2868, actual Connect level 27.
- Kyndlo: screenshots exported with the browser's pageAssets capability from its live Google Play listing. The home screenshot is `assets/apps/kyndlo-screen.webp`.
- Daily Spirit: the uploaded real icon is used; no gameplay screenshots were invented.

Screenshots use their original full aspect ratios. WebP encoding reduces transfer sizes without artistic changes to their content. The original user-supplied PNGs remain in this project.

## Studio branding and design

- The handoff's five-sphere logo direction is reconstructed with editable SVG paths, ellipses, circles and gradients. Wordmark paths are original geometric lettering, with no raster payload, font dependency or external asset references.
- Color variants: light and dark lettering; white and navy monochrome. Horizontal, stacked and mark-only compositions are included.
- Mark invariant: two large parents, three small children, two blue and three purple spheres, three orbit paths, empty center, one purple child on the innermost ring.
- `Manrope` variable font is self-hosted from Google's official font service. License: `assets/fonts/OFL.txt`.
- Four section references and the standalone forest background were generated with the built-in image generation tool. Prompt briefs are recorded in `design/BRIEF.md`. Generated app UI and invented icons from any mockup were not used as production assets.

## October 8 screenshot update

The user supplied `Screenshot 2026-10-08 at 8.46.18 PM.png` (Kyndlo Quests) and `Screenshot 2026-10-08 at 8.49.19 PM.png` (Daily Oracle Presence card). Original copies are retained as `assets/apps/kyndlo-quests-screen.png` and `assets/apps/daily-spirit-screen.png`; quality-92 WebP derivatives are displayed without cropping or altering the interface. Both now appear in full homepage sections and their corresponding product pages. The verified store title Daily Spirit remains the website label.
