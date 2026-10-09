"""Check every static page's local references, anchors, real store links and SVG invariants."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from xml.etree import ElementTree as ET
import json
import re

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.refs, self.ids, self.h1 = [], set(), 0
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs: self.ids.add(attrs['id'])
        if tag == 'h1': self.h1 += 1
        for attr in ['href','src']:
            if attr in attrs: self.refs.append(attrs[attr])

pages = {p:Page(p.read_text()) for p in ROOT.rglob('*.html') if '.git' not in p.parts}
checked = 0
for path, page in pages.items():
    assert page.h1 == 1, f'{path}: expected one main heading'
    for ref in page.refs:
        url=urlsplit(ref)
        if url.scheme or url.netloc: continue
        target = ROOT / unquote(url.path).lstrip('/') if url.path.startswith('/') else path.parent / unquote(url.path) if url.path else path
        if target.is_dir(): target=target/'index.html'
        assert target.is_file(), f'{path}: missing {ref}'
        if url.fragment and target.suffix=='.html':
            assert url.fragment in pages[target.resolve()].ids, f'{path}: missing anchor {ref}'
        checked += 1
for asset in re.findall(r"url\(['\"]?(/[^)'\"]+)", (ROOT/'studio.css').read_text()):
    assert (ROOT/asset.lstrip('/')).is_file(), f'Missing CSS asset: {asset}'

apps=json.loads((ROOT/'data/apps.json').read_text())
for app in apps:
    page=(ROOT/app['slug']/'download/index.html').read_text()
    for key, store in [('apple','app_store'),('google','google_play')]:
        assert (f'data-store="{store}"' in page) == bool(app[key]), f'Unavailable store offered for {app["name"]}'
    if app['apple']: assert urlsplit(app['apple']).hostname=='apps.apple.com'
    if app['google']: assert urlsplit(app['google']).hostname=='play.google.com'

for logo in (ROOT/'assets/brand').glob('*.svg'):
    tree=ET.parse(logo)
    bodies=[el for el in tree.iter() if 'data-body' in el.attrib]
    assert len(bodies)==5, f'{logo}: wrong sphere count'
    assert len([b for b in bodies if b.attrib['data-body'].startswith('parent')])==2
    assert len([b for b in bodies if b.attrib['data-body'].startswith('child')])==3
    assert len([b for b in bodies if 'blue' in b.attrib['data-body']])==2
    assert len([b for b in bodies if 'purple' in b.attrib['data-body']])==3
    assert len([el for el in tree.iter() if el.tag.endswith('ellipse')])==3
    assert not any(el.tag.endswith('image') or el.tag.endswith('text') for el in tree.iter()), 'Font/raster dependency in SVG'
print(f'{len(pages)} pages, {checked} local links/assets, CSS assets, store availability and twelve SVG logos verified.')
