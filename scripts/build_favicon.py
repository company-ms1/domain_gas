"""Build the vector stingray and raster favicon variants (requires Pillow)."""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
BACKGROUND = '#060912'
FOREGROUND = '#57e8a6'
# A top-down ray: broad swept wings, a small head, and a tapering curved tail.
START = (32, 15)
CURVES = [
    (29, 15, 27, 19, 25, 21),
    (21, 22, 13, 18, 5, 14),
    (7, 25, 13, 33, 22, 35),
    (26, 36, 28, 39, 30, 40),
    (31, 46, 35, 53, 43, 55),
    (38, 51, 35, 45, 35, 39),
    (38, 36, 40, 35, 43, 35),
    (52, 32, 57, 24, 59, 14),
    (51, 18, 43, 22, 39, 21),
    (37, 19, 35, 15, 32, 15),
]


def main():
    path = f'M {START[0]} {START[1]} ' + ' '.join(
        'C ' + ' '.join(map(str, curve)) for curve in CURVES
    ) + ' Z'
    (ROOT / 'favicon.svg').write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">\n'
        '  <title>GasFree4you stingray</title>\n'
        f'  <rect width="64" height="64" rx="14" fill="{BACKGROUND}"/>\n'
        f'  <path d="{path}" fill="{FOREGROUND}"/>\n'
        '</svg>\n'
    )
    scale = 16
    master = Image.new('RGBA', (64 * scale, 64 * scale))
    draw = ImageDraw.Draw(master)
    draw.rounded_rectangle((0, 0, 64 * scale - 1, 64 * scale - 1),
                           radius=14 * scale, fill=BACKGROUND)
    points = [START]
    x0, y0 = START
    for x1, y1, x2, y2, x3, y3 in CURVES:
        for step in range(1, 65):
            t = step / 64
            u = 1 - t
            points.append((u**3*x0 + 3*u*u*t*x1 + 3*u*t*t*x2 + t**3*x3,
                           u**3*y0 + 3*u*u*t*y1 + 3*u*t*t*y2 + t**3*y3))
        x0, y0 = x3, y3
    draw.polygon([(round(x * scale), round(y * scale)) for x, y in points], fill=FOREGROUND)
    for filename, size in [('favicon.png', 192), ('apple-touch-icon.png', 180)]:
        master.resize((size, size), Image.Resampling.LANCZOS).save(ROOT / filename)
    master.save(ROOT / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])


if __name__ == '__main__':
    main()
