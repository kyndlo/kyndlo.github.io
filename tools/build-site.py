"""Generate readable static HTML from the shared app catalog. No runtime dependencies."""
from pathlib import Path
from html import escape as e
import json
import re

ROOT = Path(__file__).resolve().parents[1]
APPS = json.loads((ROOT / 'data/apps.json').read_text())
ARROW = '<span aria-hidden="true">↗</span>'

def brand():
    return '<a class="brand" href="/" aria-label="FiveOrbit Studio home"><img src="/assets/brand/fiveorbit-logo-light.svg" width="680" height="130" alt="FiveOrbit Studio"></a>'

def header():
    return f'''<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header wrap">{brand()}<nav aria-label="Primary navigation"><a href="/#apps">Apps</a><a href="/#story">Our story</a><a href="mailto:carlos@kyndlo.com">Contact</a></nav></header>'''

def footer():
    return f'''<footer class="site-footer"><div class="wrap footer-inner">{brand()}<p>© 2026 KYNDLO LLC</p><nav aria-label="Footer navigation"><a href="/privacy/">Privacy</a><a href="mailto:carlos@kyndlo.com">Contact</a></nav></div></footer>'''

def page(title, desc, body, path='/', attrs='', download=False, analytics=True):
    scripts = '<script defer src="/scripts/hiddenform-analytics.js?v=fiveorbit-analytics-2"></script>' if analytics else ''
    if download:
        scripts += '\n<script defer src="/scripts/download.js?v=fiveorbit-analytics-2"></script>'
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{e(desc, quote=True)}">
  <meta name="theme-color" content="#080c19">
  <meta property="og:title" content="{e(title, quote=True)}">
  <meta property="og:description" content="{e(desc, quote=True)}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://fiveorbit.studio/assets/brand/fiveorbit-social.png">
  <title>{e(title)}</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/studio.css">
  <link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
{scripts}
</head>
<body {attrs}>
{header()}
{body}
{footer()}
</body>
</html>
'''

def icon(app, cls='app-icon'):
    return f'<img class="{cls}" src="{app["icon"]}" width="360" height="360" alt="{e(app["name"])} app icon">'

def phone(app, cls='', eager=False):
    return f'''<div class="phone {cls}"><img src="{app['screen']}" width="1320" height="2868" alt="{e(app['screenAlt'])}" {'fetchpriority="high"' if eager else 'loading="lazy"'}></div>'''

def buttons(app, explore=True):
    slug = app['slug']
    if slug == 'daily-spirit':
        primary = f'<a class="button" href="/{slug}/download/">Check availability {ARROW}</a>'
    else:
        label = 'Get Kyndlo' if slug == 'kyndlo' else 'Download ' + app['name']
        primary = f'<a class="button" href="/{slug}/download/">{label} {ARROW}</a>'
    if explore:
        label = 'Explore Daily Spirit' if slug == 'daily-spirit' else 'Explore the app' if slug == 'kyndlo' else 'Explore the game'
        primary += f'<a class="button button-outline" href="/{slug}/">{label} {ARROW}</a>'
    return f'<div class="actions">{primary}</div><p class="availability">{app["availability"]}</p>'

def store_links(app):
    links=[]
    for key,store,label in [('apple','app_store','App Store'),('google','google_play','Google Play')]:
        if app[key]:
            suffix = ' · Open testing' if app['slug']=='kyndlo' else ''
            links.append(f'<a class="store-button" data-store="{store}" href="{e(app[key],quote=True)}"><span class="store-label">{label}</span><span class="store-detail">{("Join the Android test" if suffix else "Download for " + ("iPhone & iPad" if app["slug"]=="hiddenform" and key=="apple" else "iPhone" if key=="apple" else "Android"))}</span>{ARROW}</a>')
    return '<div class="store-options">' + ''.join(links) + '</div>' if links else ''

def write(path, text):
    file = ROOT / path
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(text)

hidden, prism, kyndlo, spirit = APPS
hero = f'''<section class="hero wrap" aria-labelledby="hero-title">
<div class="hero-copy"><h1 id="hero-title">Little worlds.<br>Big <span>possibilities.</span></h1><p>Games to get lost in. Apps to bring you closer.<br class="desktop-break"> Made with care by our family, for yours.</p><a class="button" href="#apps">Explore our apps <span aria-hidden="true">↓</span></a></div>
<div class="hero-visual">{phone(hidden,'hero-hiddenform',True)}{phone(prism,'hero-prism',True)}</div>
</section>
<nav class="app-index wrap" aria-label="Explore our apps">{''.join(f'<a href="#{a["slug"]}">{a["name"]}</a>' for a in APPS)}</nav>'''

def featured(app):
    slug=app['slug']
    return f'''<article class="featured {slug}" id="{slug}" aria-labelledby="{slug}-title"><div class="feature-copy"><div class="app-identity">{icon(app)}<h2 id="{slug}-title">{app['name']}</h2></div><h3>{app['headline'][0]}<br>{app['headline'][1]}</h3><p class="feature-description">{app['description']}</p>{buttons(app)}</div><div class="feature-visual">{phone(app)}</div></article>'''

def compact(app):
    slug=app['slug']
    label = 'Get Kyndlo' if slug=='kyndlo' else 'Explore Daily Spirit'
    dest = f'/{slug}/download/' if slug=='kyndlo' else f'/{slug}/'
    return f'''<article class="compact-app {slug}" id="{slug}" aria-labelledby="{slug}-title">{icon(app)}<div class="compact-copy"><h2 id="{slug}-title">{app['name']}</h2><h3>{' '.join(app['headline'])}</h3><p>{app['description']}</p><div class="compact-actions"><a class="button" href="{dest}">{label} {ARROW}</a><p class="availability">{app['availability']}</p></div></div><a class="compact-more" href="/{slug}/{'download/' if slug=='daily-spirit' else ''}">{'Check availability' if slug=='daily-spirit' else 'Explore the app'} {ARROW}</a></article>'''

story = '''<section class="story wrap" id="story" aria-labelledby="story-title"><div class="story-mark"><img src="/assets/brand/fiveorbit-stacked-light.svg" width="600" height="460" alt="FiveOrbit Studio: five family members, connected by three orbits"></div><div><h2 id="story-title">Five orbits.<br>One shared world.</h2><p>We’re a husband-and-wife team making games and apps with curiosity, care, and a little imagination. FiveOrbit is named for our family of five — connected by the gravity of love.</p><a class="text-link" href="mailto:carlos@kyndlo.com">Say hello <span aria-hidden="true">↗</span></a></div></section>'''
body=f'<main id="main">{hero}<section class="collection wrap" id="apps" aria-label="Our apps and games">{featured(hidden)}{featured(prism)}{featured(kyndlo)}{featured(spirit)}</section>{story}</main>'
write('index.html',page('FiveOrbit Studio — Little worlds. Big possibilities.','Explore HiddenForm, Prism Lines, Kyndlo and Daily Spirit. Games and apps made with care by our family, for yours.',body))

for app in APPS:
    slug=app['slug']
    visual=phone(app) if app['screen'] else icon(app,'spirit-art')
    facts=''.join(f'<div><h3>{e(title)}</h3><p>{e(copy)}</p></div>' for title,copy in app['facts'])
    download_intro = 'Daily Spirit is coming soon. Store downloads will appear here when it launches.' if slug=='daily-spirit' else 'Kyndlo is available through Android open testing. iOS is coming soon.' if slug=='kyndlo' else 'Choose Download on your phone to open the right store, or pick a store below.'
    body=f'''<main id="main" class="product-page wrap"><a class="back-link" href="/#apps">← All apps</a>
<section class="product-hero {slug}" aria-labelledby="product-title"><div class="product-copy"><div class="app-identity">{icon(app)}<div><h1 id="product-title">{app['name']}</h1><p class="category">{app['category']}</p></div></div><h2>{app['headline'][0]}<br>{app['headline'][1]}</h2><p class="feature-description">{app['description']}</p>{buttons(app,False)}</div><div class="product-visual">{visual}</div></section>
<section class="product-detail" aria-label="About {app['name']}"><p class="product-intro">{app['detail']}</p><div class="product-facts">{facts}</div></section>
<section class="download-section {slug}" id="download" aria-labelledby="download-title"><div><h2 id="download-title">{'Something to look forward to.' if slug=='daily-spirit' else 'Your next little world awaits.'}</h2><p>{download_intro}</p>{buttons(app,False)}</div><div>{store_links(app)}<a class="text-link privacy-link" href="{app['privacy']}">App privacy policy {ARROW}</a></div></section>
</main>'''
    write(f'{slug}/index.html',page(f'{app["name"]} — FiveOrbit Studio',app['description'],body,path=f'/{slug}/'))
    status = 'Daily Spirit is coming soon. Store downloads will appear here when it launches.' if slug=='daily-spirit' else 'Open this page on your Android phone to visit Google Play, or choose the open test below.' if slug=='kyndlo' else 'On a phone? We’ll open the right store automatically. On a computer? Choose your store below.'
    notes = '<p class="platform-note">iOS coming soon. Android access is currently through open testing and may depend on your Google Play account or region.</p>' if slug=='kyndlo' else ''
    if slug=='daily-spirit':
        notes='<p class="platform-note">Not available to download yet.</p><a class="button button-outline" href="/daily-spirit/">Discover the app '+ARROW+'</a>'
    body=f'''<main id="main" class="download-page wrap"><a class="back-link" href="/{slug}/">← About {app['name']}</a><section class="download-panel {slug}" aria-labelledby="download-title">{icon(app)}<h1 id="download-title">{'Daily Spirit is on its way.' if slug=='daily-spirit' else 'Get '+app['name']}</h1><p id="redirect-status" role="status" aria-live="polite">{status}</p>{store_links(app)}{notes}<p class="download-help">Need a hand? <a href="mailto:carlos@kyndlo.com">Contact us</a>.</p></section></main>'''
    attrs=f'data-download-app="{slug}" data-app-name="{app["name"]}"'
    html=page(f'Download {app["name"]} — FiveOrbit Studio',f'Download availability and store options for {app["name"]}.',body,path=f'/{slug}/download/',attrs=attrs,download=True)
    write(f'{slug}/download/index.html',html)
    if slug=='hiddenform':
        write('whim-and-wood-support/download/index.html',html)

def redirect(path,destination):
    # Preserve campaign parameters and fragments on legacy product links.
    content=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FiveOrbit Studio</title><link rel="stylesheet" href="/studio.css"><link rel="canonical" href="{destination}"></head><body><main class="redirect-fallback wrap"><h1>Find your next little world.</h1><p>This page has moved. <a href="{destination}">Continue to the app</a>.</p></main><script>location.replace({json.dumps(destination)} + location.search + location.hash);</script></body></html>'''
    write(path,content)
redirect('prims-lines/index.html','/prism-lines/')
redirect('daily-oracle/index.html','/daily-spirit/')
redirect('wooden-wonders/index.html','/hiddenform/')

policies=''.join(f'<li><a href="{a["privacy"]}">{a["name"]} {ARROW}</a></li>' for a in APPS)
body=f'''<main id="main" class="policy-page wrap"><h1>Privacy</h1><p class="policy-lede">Find the privacy information for each of our apps, plus the notice for optional FiveOrbit website analytics.</p><h2>App privacy policies</h2><ul class="policy-links">{policies}</ul><h2>Website analytics</h2><p>FiveOrbit Studio’s website, app pages and download pages offer optional analytics. Downloads work with either choice.</p><a class="text-link" href="/hiddenform/privacy.html">Read the website analytics notice {ARROW}</a><p>Questions? <a href="mailto:carlos@kyndlo.com">carlos@kyndlo.com</a></p></main>'''
write('privacy/index.html',page('Privacy — FiveOrbit Studio','Privacy links for FiveOrbit Studio apps and HiddenForm website analytics.',body,analytics=False))

# Preserve the existing analytics notice verbatim; change only its surrounding presentation.
notice_path=ROOT/'hiddenform/privacy.html'
notice=notice_path.read_text()
if 'data-preserved-analytics-notice' in notice:
    inner=re.search(r'<article data-preserved-analytics-notice>(.*?)</article>',notice,re.S).group(1)
else:
    inner=re.search(r'<main[^>]*>(.*?)</main>',notice,re.S).group(1)
body=f'<main id="main" class="policy-page wrap"><article data-preserved-analytics-notice>{inner}</article></main>'
write('hiddenform/privacy.html',page('HiddenForm website analytics — FiveOrbit Studio','Optional HiddenForm website analytics and your choices.',body,analytics=False))
print('Generated homepage, four product pages, four download pages, legacy routes and privacy pages.')
