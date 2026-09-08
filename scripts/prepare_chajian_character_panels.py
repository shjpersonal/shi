from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "chajian"
PANEL_SIZE = (900, 600)
BACKGROUND = (247, 240, 230)

MODULES = {
    "character-panel-grandmother.png": ("character-grandmother-v2.png", (38, 72, 808, 500)),
    "character-panel-child.png": ("character-acha-child-v2.png", (34, 64, 718, 474)),
    "character-panel-teen.png": ("character-acha-teen-v2.png", (28, 62, 670, 462)),
    "character-panel-adult.png": ("character-acha-adult-v2.png", (32, 62, 650, 474)),
    "character-panel-ahe.png": ("character-ahe-v2.png", (32, 52, 608, 416)),
    "character-panel-festival.png": ("character-festival-v2.png", (18, 48, 658, 430)),
}

for output, (source, box) in MODULES.items():
    with Image.open(ROOT / source).convert("RGB") as image:
        artwork = image.crop(box)
        max_width, max_height = 820, 510
        scale = min(max_width / artwork.width, max_height / artwork.height, 1)
        if scale < 1:
            artwork = artwork.resize(
                (round(artwork.width * scale), round(artwork.height * scale)),
                Image.Resampling.LANCZOS,
            )
        panel = Image.new("RGB", PANEL_SIZE, BACKGROUND)
        panel.paste(artwork, ((PANEL_SIZE[0] - artwork.width) // 2, (PANEL_SIZE[1] - artwork.height) // 2))
        panel.save(ROOT / output, optimize=True)
        print(output, artwork.size)
