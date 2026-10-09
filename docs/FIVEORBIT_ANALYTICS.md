# FiveOrbit website analytics

Updated October 8, 2026 (America/Denver).

Existing GA4 property 557305387, account 385583141, web stream 16041531990, measurement ID `G-1WQP76REKQ` are reused to retain historical reporting. The dashboard's existing property/stream names remain HiddenForm / HiddenForm website; the implementation now covers the entire studio website.

## Recorded values

| Event | Purpose |
| --- | --- |
| page_view | Consented home, app and download page visits |
| app_explore | App detail links and homepage app navigation |
| download_cta_click | App download/availability button leading to a selector |
| download_click | Manual App Store or Google Play link |
| store_redirect | Automatic OS-based store navigation |
| contact_click | Contact link interaction, without email address in the event |

`app_slug` distinguishes hiddenform, prism-lines, kyndlo, daily-spirit and studio. `page_type` distinguishes home, app and download. `store` identifies app_store, google_play, store_selector, or none for exploration. `game` remains as a compatible app label for historical events. Page location excludes unrelated URL queries; only sanitized utm_source, utm_medium, utm_campaign, utm_content and utm_term are carried across product and download links. GA provides its standard browser, device, acquisition and session dimensions. No invented purchase price, revenue or install event is sent.

## GA4 dashboard changes completed

Created event-scoped App (`app_slug`) and Page type (`page_type`) custom dimensions. Updated the existing Store (`store`) description for all apps. Verified download_click and store_redirect remain key events. New dimensions apply to newly collected events; report availability can take 24–48 hours.

## Consent and navigation

The tag loads only after permission. New studio consent uses `fiveorbit_analytics_consent`. The earlier HiddenForm-only preference is honored only on HiddenForm routes and does not silently authorize other apps. Visitors can change their choice with Analytics choices. Ads personalization and Google signals remain disabled. The shared script filename stays unchanged because the separate legacy support project loads it remotely.

First-time mobile download visitors are sent directly to their store without an analytics prompt; those unconsented redirects are not measured. Store campaign labels still travel with the links. Consented redirects wait for a beacon callback with a 900 ms maximum fallback. Missing store listings do not cause a redirect.

Localhost previews never send production analytics, even when consent is granted. Fifty simulated routing/campaign/consent cases pass, including all four apps, studio page views, consent scope, unavailable stores and duplicate-callback protection. Static verification passes for 15 pages and 213 local references.

Website code is updated locally and requires deployment before live visitors use the new instrumentation. Dashboard dimension changes are already saved. Website analytics measures visits and store intent, not actual app installations or behavior inside native apps.

## References

- https://developers.google.com/analytics/devguides/collection/ga4/events
- https://developers.google.com/analytics/devguides/collection/ga4/event-parameters
- https://support.google.com/analytics/answer/14240153
