from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "chajian"
SOURCE = ROOT / "board-02.png"
ROWS = [(2050, 2500), (2540, 2995), (3035, 3485)]
COLUMNS = [(100, 920), (925, 1735), (1740, 2560), (2565, 3395)]

with Image.open(SOURCE).convert("RGB") as image:
    number = 1
    for top, bottom in ROWS:
        for left, right in COLUMNS:
            frame = image.crop((left + 4, top + 4, right - 4, bottom - 4))
            output = ROOT / f"storyboard-v2-{number:02d}.jpg"
            frame.save(output, quality=94, optimize=True, progressive=True)
            print(output.name, frame.size)
            number += 1
