from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "shadow"

CROPS = {
    "cover.png": ("board-01.png", (0, 0, 3368, 1320)),
    "character-card.png": ("board-01.png", (95, 1380, 1665, 2480)),
    "turnaround.png": ("board-01.png", (1700, 1380, 3265, 2480)),
    "expressions.png": ("board-01.png", (95, 2490, 3265, 3490)),
    "costumes.png": ("board-01.png", (95, 3510, 3265, 4620)),
    "poster-wall.png": ("board-02.png", (85, 130, 3265, 1690)),
    "products.png": ("board-02.png", (85, 1770, 3265, 3040)),
    "lifestyle.png": ("board-02.png", (85, 3000, 3265, 4580)),
    "poster-rider.jpg": ("poster-01.jpg", (0, 0, 3508, 4140)),
    "poster-warrior.jpg": ("poster-02.jpg", (0, 0, 3509, 4250)),
    "poster-qilin.jpg": ("poster-03.jpg", (0, 0, 3509, 4070)),
}

for output, (source, box) in CROPS.items():
    with Image.open(ROOT / source) as image:
        cropped = image.crop(box)
        if output.endswith(".jpg"):
            cropped.save(ROOT / output, optimize=True, quality=88, progressive=True)
        else:
            cropped.save(ROOT / output, optimize=True)
        print(output, box)
