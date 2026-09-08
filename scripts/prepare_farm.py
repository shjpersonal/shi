from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "farm"
CROPS = {
    "gameplay-overview.png": ("game-board.png", (700, 1350, 4050, 2850)),
    "animal-sprites.png": ("game-board.png", (350, 3250, 8550, 4950)),
    "economy-loop.png": ("game-board.png", (350, 4900, 8550, 6500)),
}

for output, (source, box) in CROPS.items():
    with Image.open(ROOT / source) as image:
        cropped = image.crop(box)
        cropped.save(ROOT / output, optimize=True)
        print(output, cropped.size)
