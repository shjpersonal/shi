from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "chajian"

CROPS = {
    "cover-wide.jpg": ("board-01.png", (0, 0, 3508, 1000)),
    "character-grandmother.png": ("board-01.png", (900, 3300, 1690, 3895)),
    "character-acha.png": ("board-01.png", (900, 3950, 1690, 4550)),
    "character-ahe.png": ("board-01.png", (1710, 3950, 2490, 4550)),
    "storyboard-row-01.jpg": ("board-02.png", (95, 2050, 3410, 2550)),
    "storyboard-row-02.jpg": ("board-02.png", (95, 2540, 3410, 3045)),
    "storyboard-row-03.jpg": ("board-02.png", (95, 3035, 3410, 3525)),
}

for output, (source, box) in CROPS.items():
    with Image.open(ROOT / source).convert("RGB") as image:
        cropped = image.crop(box)
        if output.endswith(".jpg"):
            cropped.save(ROOT / output, quality=91, optimize=True, progressive=True)
        else:
            cropped.save(ROOT / output, optimize=True)
        print(output, cropped.size)
