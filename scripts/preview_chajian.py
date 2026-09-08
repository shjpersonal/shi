from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / "public" / "assets" / "chajian"
for name in ("board-01", "board-02"):
    with Image.open(root / f"{name}.png").convert("RGB") as image:
        image.thumbnail((1400, 2000), Image.Resampling.LANCZOS)
        image.save(root / f"{name}-preview.jpg", quality=82, optimize=True)
