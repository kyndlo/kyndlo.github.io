# HiddenForm acquisition tracking

Created October 4, 2026. GA4 property: HiddenForm. Web stream: HiddenForm website (16041531990). Measurement ID: G-1WQP76REKQ. Reporting timezone: America/Denver.

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

Apple links carry ct campaign labels and mt=8. Apple campaign attribution is NOT complete until the official provider token (pt) from App Store Connect's campaign-link builder is added. Do not invent the token. Apple sign-in expired during setup. Use HiddenForm > Analytics > Acquisition > Campaigns to generate an official link, obtain the provider token, and insert it into store links. Campaign metrics have Apple's minimum reporting thresholds.

Use the same campaign labels on the landing-page ad URLs and outgoing store links to compare ads → consented website activity → store acquisitions. These are aggregate reports, not a guaranteed person-by-person funnel.

Sources:
- https://support.google.com/analytics/answer/12923437
- https://support.google.com/googleplay/android-developer/answer/6263332
- https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links
