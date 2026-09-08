from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "beihai"

CROPS = {
    "cover-clear.png": ("board-02.png", (0, 0, 842, 430)),
    "profile-clear.png": ("board-02.png", (58, 500, 792, 772)),
    "views-clear.png": ("board-02.png", (58, 850, 792, 1145)),
    "peripherals-clear.png": ("board-01.png", (72, 150, 795, 430)),
    "expressions-clear.png": ("board-01.png", (105, 500, 750, 770)),
    "posters-clear.png": ("board-01.png", (50, 850, 795, 1138)),
}

for output, (source, box) in CROPS.items():
    with Image.open(ROOT / source).convert("RGB") as image:
        cropped = image.crop(box)
        enlarged = cropped.resize((cropped.width * 3, cropped.height * 3), Image.Resampling.LANCZOS)
        enlarged.save(ROOT / output, optimize=True)
        print(output, enlarged.size)
