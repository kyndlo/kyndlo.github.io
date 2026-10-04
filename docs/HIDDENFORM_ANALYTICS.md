# HiddenForm acquisition tracking

Created October 4, 2026. GA4 property: HiddenForm (557305387). Dashboard: https://analytics.google.com/analytics/web/#/a385583141p557305387/reports/intelligenthome. Web stream: HiddenForm website (16041531990). Measurement ID: G-1WQP76REKQ. Reporting timezone: America/Denver.

The route /whim-and-wood-support/download/ is served by the separate kyndlo/whim-and-wood-support project Pages repository. Its page loads the shared script hosted in kyndlo/kyndlo.github.io at /scripts/hiddenform-analytics.js. Update the project page when changing this route.

Send ads to https://kindlo.app/whim-and-wood-support/download/ with campaign tags, for example:

https://kindlo.app/whim-and-wood-support/download/?utm_source=instagram&utm_medium=paid_social&utm_campaign=hiddenform_launch&utm_content=lion_video_01

Use lowercase stable campaign labels; never include personal information. Change source for each advertising platform and content for each creative. Do not add manual UTMs that override Google Ads auto-tagging without reviewing attribution.

## Website measurement

The dedicated tag loads only on /hiddenform/ and /whim-and-wood-support/download/, after analytics consent. The homepage carries campaign labels into HiddenForm links but does not load this tag.

- page_view: consented website visits.
- download_cta_click: consented Get HiddenForm clicks leading to the download page.
- download_click: consented manual Apple/Google store-button clicks; store is app_store or google_play.
- store_redirect: consented automatic redirects; this is separate from a manual click.

Phone routing is preserved: iPhone/iPad, including desktop-mode iPad, to Apple; Android to Google Play. Desktops and unknown devices show both buttons. There is a bounded 900 ms fallback for analytics-enabled navigation, so blocked analytics does not strand visitors.

First-time mobile visitors immediately leave for the store, without an opportunity to opt into website analytics. Those visits/redirects are not collected by GA4. Their store URLs still carry campaign labels. Do not interpret GA4 counts as all ad clicks or installs. Browser blockers and consent also reduce measurements.

In GA4, use Traffic acquisition for session source/medium and campaign, Events for download_click/store_redirect, and Realtime to verify fresh consenting visits. Actual store installs are separate metrics.

## Store measurement

Google Play links preserve utm_source and utm_campaign (and medium). Use Play Console store performance/acquisition reports, including UTM source/campaign and country. These are store-reported acquisitions, subject to Google's attribution coverage; not every web visit or impression is represented.

Apple links carry official provider token pt=128479651, ct campaign labels and mt=8. The token was verified in HiddenForm > Analytics > Acquisition > Campaigns > Generate a Campaign Link. Labels combine source, campaign and creative; labels exceeding Apple's 30-character limit use a readable prefix plus a deterministic hash. Campaign metrics have Apple's minimum reporting thresholds. Official baseline link: https://apps.apple.com/app/apple-store/id6809650487?pt=128479651&ct=hiddenform_website&mt=8. The Store event-scoped custom dimension is registered in GA4 for parameter store.

Use the same campaign labels on the landing-page ad URLs and outgoing store links to compare ads → consented website activity → store acquisitions. These are aggregate reports, not a guaranteed person-by-person funnel.

Sources:
- https://support.google.com/analytics/answer/12923437
- https://support.google.com/googleplay/android-developer/answer/6263332
- https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links
