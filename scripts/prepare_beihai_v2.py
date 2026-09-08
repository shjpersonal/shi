from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "beihai"

CROPS = {
    "identity-v2.png": ("board-02.png", (54, 510, 790, 765)),
    "views-v2.png": ("board-02.png", (58, 850, 785, 1120)),
    "expressions-v2.png": ("board-01.png", (70, 500, 775, 785)),
    "peripherals-tags-v2.png": ("board-01.png", (65, 150, 405, 435)),
    "peripherals-display-v2.png": ("board-01.png", (410, 150, 780, 340)),
    "posters-v2.png": ("board-01.png", (48, 855, 792, 1085)),
}

for output, (source, box) in CROPS.items():
    with Image.open(ROOT / source) as image:
        crop = image.crop(box)
        crop.save(ROOT / output, optimize=True)
        print(output, crop.size)
