"""Build the FiveOrbit identity from editable vector geometry, without fonts or bitmaps."""
from pathlib import Path
from math import cos, sin, radians

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'brand'
OUT.mkdir(parents=True, exist_ok=True)

# Original angular lettering drawn as paths. Each glyph is independently editable.
GLYPHS = [
    ('F', 62, 'M0 80V14L14 0H62L49 15H18V31H52L39 46H18V66Z'),
    ('i', 24, 'M2 17V3L17 0V17ZM2 80V31L17 25V69Z'),
    ('v', 64, 'M0 25H19L33 59L47 25H64L39 80H25Z'),
    ('e', 61, 'M0 38L13 25H60V40H19V46H51L40 58H19V65H60L46 80H13L0 67Z'),
    ('O', 70, 'M0 15L15 0H55L70 15V65L55 80H15L0 65ZM19 17V63H51V17Z'),
    ('r', 48, 'M0 80V38L13 25H48L35 40H18V69Z'),
    ('b', 61, 'M0 80V0L18 10V25H47L61 39V66L47 80ZM18 40V65H42V40Z'),
    ('i', 24, 'M2 17V3L17 0V17ZM2 80V31L17 25V69Z'),
    ('t', 46, 'M10 65V41H0V25H10V0L28 10V25H46L34 41H28V65H46L32 80H24Z'),
]
def wordmark(color):
    x = 0
    parts = []
    for letter, width, path in GLYPHS:
        parts.append(f'<path data-letter="{letter}" transform="translate({x} 0)" d="{path}"/>')
        x += width + 7
    return f'<g fill="{color}" fill-rule="evenodd">' + ''.join(parts) + '</g>'

def studio(color):
    # A geometric single-stroke subtitle, also independent of installed fonts.
    paths = ['M14 0H3L0 3V7L3 10H11L14 13V17L11 20H0', 'M0 0H16M8 0V20',
             'M0 0V16L4 20H12L16 16V0', 'M0 20V0H10L16 6V14L10 20Z',
             'M4 0V20', 'M4 0H12L16 4V16L12 20H4L0 16V4Z']
    return f'<g fill="none" stroke="{color}" stroke-width="2.3" stroke-linejoin="miter">' + ''.join(f'<path transform="translate({i * 39} 0)" d="{p}"/>' for i,p in enumerate(paths)) + '</g>'

def point(rx, ry, angle):
    a, r = radians(angle), radians(-32)
    return 160 + rx*cos(a)*cos(r)-ry*sin(a)*sin(r), 135 + rx*cos(a)*sin(r)+ry*sin(a)*cos(r)

BODIES = [
    ('parent-blue', *point(135, 89, -10), 22, 'blue'),
    ('parent-purple', *point(135, 89, 160), 23, 'purple'),
    ('child-purple-inner', *point(75, 40, 245), 10, 'purple'),
    ('child-purple-right', *point(107, 65, 45), 12, 'purple'),
    ('child-blue-bottom', *point(135, 89, 100), 12, 'blue'),
]

def mark(mono=None):
    defs = '''<defs>
<linearGradient id="orbit" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#30e5f2"/><stop offset=".45" stop-color="#3684ff"/><stop offset=".73" stop-color="#8545ff"/><stop offset="1" stop-color="#cf77ff"/></linearGradient>
<radialGradient id="blue" cx=".28" cy=".2" r=".9"><stop stop-color="#83f7ff"/><stop offset=".32" stop-color="#16d4ef"/><stop offset="1" stop-color="#1760ff"/></radialGradient>
<radialGradient id="purple" cx=".28" cy=".2" r=".9"><stop stop-color="#e5b0ff"/><stop offset=".35" stop-color="#b760fa"/><stop offset="1" stop-color="#5823ef"/></radialGradient>
<mask id="ring-gaps"><rect width="320" height="270" fill="white"/>'''
    defs += ''.join(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r+4}" fill="black"/>' for _,x,y,r,_ in BODIES)
    defs += '</mask></defs>'
    stroke = mono or 'url(#orbit)'
    rings = f'<g mask="url(#ring-gaps)"><g fill="none" stroke="{stroke}" stroke-width="4" transform="rotate(-32 160 135)">'
    rings += ''.join(f'<ellipse cx="160" cy="135" rx="{rx}" ry="{ry}"/>' for rx,ry in [(135,89),(107,65),(75,40)]) + '</g></g>'
    spheres = ''.join(f'<circle data-body="{name}" cx="{x:.2f}" cy="{y:.2f}" r="{r}" fill="{mono or "url(#"+color+")"}"/>' for name,x,y,r,color in BODIES)
    return defs + rings + spheres

def svg(viewbox, content, desc):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-labelledby="title desc"><title id="title">FiveOrbit Studio</title><desc id="desc">{desc}</desc>{content}</svg>\n'

description = 'Five family members on three orbits. Two large parents, three small children, an open center. Two blue and three purple spheres.'
for variant, color in [('light','#f5f6fc'),('dark','#080c19'),('mono','#ffffff'),('mono-dark','#080c19')]:
    monochrome = color if variant.startswith('mono') else None
    symbol = mark(monochrome)
    (OUT / f'fiveorbit-mark-{variant}.svg').write_text(svg('0 0 320 270',symbol,description))
    horizontal = f'<g transform="translate(0 2) scale(.45)">{symbol}</g><g transform="translate(158 21) scale(.87)">{wordmark(color)}</g><g transform="translate(290 102) scale(.72)">{studio(color)}</g>'
    (OUT / f'fiveorbit-logo-{variant}.svg').write_text(svg('0 0 680 130',horizontal,description+' Angular FiveOrbit wordmark with Studio beneath.'))
    stacked = f'<g transform="translate(140 0)">{symbol}</g><g transform="translate(43 305) scale(.94)">{wordmark(color)}</g><g transform="translate(195 410)">{studio(color)}</g>'
    (OUT / f'fiveorbit-stacked-{variant}.svg').write_text(svg('0 0 600 460',stacked,description+' Angular FiveOrbit wordmark with Studio beneath.'))
(ROOT / 'favicon.svg').write_text(svg('0 0 320 270',mark(),description))
print('Generated twelve font-independent SVG logo variants and favicon.')
