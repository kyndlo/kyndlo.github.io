# HiddenForm ChatGPT campaign measurement

Prepared October 20, 2026. Reuse the existing FiveOrbit Studio GA4 property
557305387 and web measurement ID G-1WQP76REKQ.

## Ad destination

Use this URL for the first creative:

https://fiveorbit.studio/hiddenform/download/?utm_source=chatgpt&utm_medium=cpc&utm_campaign=hf_launch&utm_content=ad01

Keep source, medium and campaign consistent across this launch. Use ad02,
ad03, etc. for other creatives. Use a new campaign label for a separate test.
Do not add reserved OpenAI click parameters manually.

## Where to measure

| System | Measure | Filter |
| --- | --- | --- |
| ChatGPT Ads Manager | Impressions, clicks, spend, CTR, CPC | Launch campaign and ad |
| GA4 Traffic acquisition | Consented website sessions and store-intent key events | Session source / medium = chatgpt / cpc; Session campaign = hf_launch |
| App Store Connect Analytics, Acquisition, Campaigns | Apple campaign downloads and available downstream metrics | chatgpt.hf_launch.ad01 |
| Play Console Statistics | New store listing acquisitions (completed installs by new users) | UTM source = chatgpt; UTM campaign = hf_launch |

GA4's existing download_click and store_redirect events measure store intent,
not installs. No new GA4 property or tag is needed to recognize the UTMs.
First-time mobile visitors still redirect immediately without loading analytics;
GA4 will omit these unconsented visits. Use store-reported acquisitions for the
install comparison rather than dividing spend by GA4 store-intent events.

Apple links retain provider token 128479651 and campaign token
chatgpt.hf_launch.ad01. Apple campaign reporting is delayed and subject to
minimum thresholds (at least five first-time downloaders for the campaign).

Android links retain top-level UTMs for Play Console and now also include an
encoded referrer containing campaign parameters. Reading that referrer and
connecting it to first_open, retention or revenue requires native app
instrumentation; this website change alone does not implement that.

Verified in the live Play Console on October 20: Statistics > Legacy Store
listing performance > Store listing acquisitions > New users supports UTM
source and UTM campaign breakdowns. Saved report: "HiddenForm — new installs
by ad provider". Open Statistics > Saved reports to retrieve it. The saved
report currently selects the available source values (all, unspecified and
Other); select chatgpt after it becomes available, and adjust the date range.
A second saved report, "HiddenForm — new installs by campaign", uses the same
completed-install metric with UTM campaign and a Last 90 days window. Select
hf_launch when it appears. Google currently groups low-volume tagged data
under Other; a report configuration cannot recover those hidden labels.
Low-volume sources may remain grouped as Other. Install clicks in the newer
store listing reports are a separate metric and must not be counted as installs.

Also verified in the live App Store Connect campaign generator: campaign
chatgpt.hf_launch.ad01 generates
https://apps.apple.com/app/apple-store/id6809650487?pt=128479651&ct=chatgpt.hf_launch.ad01&mt=8.
Generating a link does not make a campaign row appear before traffic and the
reporting threshold are met. Existing Instagram and website campaign rows
confirm that campaign-tagged downloads are already being reported.

Compare spend / attributed new installs by platform, then retention and revenue
when available. Align date ranges, reporting time zones, attribution windows
and definitions before comparing Meta, TikTok and ChatGPT. These are attributed
results; proving incremental lift requires a controlled experiment.

## Optional Ads Manager conversion reporting

OpenAI supports browser Pixel and server-side Conversions API measurement.
Neither is installed by this change. A store navigation can be a store-intent
conversion, but must not be reported as an app install. Actual app outcomes need
a supported attribution integration or app/backend instrumentation. Verify the
available integration before promising install optimization in Ads Manager.

## Verification and rollout

Published update adds Android referrers while retaining existing website
campaign defaults, Apple tokens, OS routing and analytics consent behavior.
The shared analytics script URL is versioned to refresh browser caches.

Run node tests/download-routing.test.cjs and python3 tests/verify-site.py.
The routing suite covers iOS/Android ChatGPT tags with absent, denied and
granted consent, without generating live analytics traffic. After deployment,
verify a consenting QA visit in GA4 Realtime using a separate QA campaign,
then inspect real store acquisition reports after campaign traffic arrives.
Never simulate an install or purchase event to validate a website redirect.

## Sources

- https://help.openai.com/en/articles/20001214-measure-results
- https://support.google.com/analytics/answer/10917952
- https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links
- https://developer.android.com/google/play/installreferrer
- https://support.google.com/googleplay/android-developer/answer/9859173
