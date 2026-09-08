from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "chajian"
SOURCE = ROOT / "board-01.png"

CROPS = {
    "character-grandmother-v2.png": (850, 3330, 1695, 3895),
    "character-acha-child-v2.png": (850, 3895, 1605, 4425),
    "character-acha-teen-v2.png": (1605, 3895, 2300, 4425),
    "character-acha-adult-v2.png": (2298, 3895, 2980, 4425),
    "character-ahe-v2.png": (850, 4410, 1490, 4885),
    "character-festival-v2.png": (2298, 4410, 2980, 4885),
}

with Image.open(SOURCE) as image:
    for output, box in CROPS.items():
        crop = image.crop(box)
        crop.save(ROOT / output, optimize=True)
        print(output, crop.size)
