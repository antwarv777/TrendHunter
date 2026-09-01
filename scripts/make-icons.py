# Генерирует иконки PWA из простого дизайна (тёмный фон + молния-тренд)
from PIL import Image, ImageDraw

COLOR_BG = (15, 17, 21, 255)
COLOR_ACCENT = (79, 140, 255, 255)

def make(size, path, rounded=False):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if rounded:
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=size // 5, fill=COLOR_BG)
    else:
        d.rectangle([0, 0, size, size], fill=COLOR_BG)
    # Молния — символ тренда
    s = size
    bolt = [
        (0.58, 0.12), (0.30, 0.55), (0.48, 0.55),
        (0.42, 0.88), (0.72, 0.42), (0.53, 0.42),
    ]
    d.polygon([(x * s, y * s) for x, y in bolt], fill=COLOR_ACCENT)
    img.save(path)
    print('ok', path)

make(512, 'public/icons/icon-512.png')
make(192, 'public/icons/icon-192.png')
make(512, 'public/icons/maskable-512.png', rounded=True)
