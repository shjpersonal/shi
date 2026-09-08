from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "baize"

CROPS = {
    "cover-complete.png": ("board-identity.png", (0, 0, 3368, 1345)),
    "identity-card.png": ("board-identity.png", (125, 1370, 1985, 3015)),
    "design-concept.png": ("board-identity.png", (2010, 1370, 3260, 3015)),
    "turnaround.png": ("board-identity.png", (120, 3040, 3240, 4580)),
    "expressions.png": ("board-expression.png", (125, 340, 3240, 1960)),
    "costumes-actions.png": ("board-expression.png", (125, 2070, 3240, 4590)),
    "merchandise.png": ("board-products.png", (115, 360, 3250, 2070)),
    "blindbox.png": ("board-products.png", (115, 2200, 3250, 3360)),
    "campaign-scenes.png": ("board-products.png", (115, 3510, 3250, 4610)),
}

for output, (source, box) in CROPS.items():
    with Image.open(ROOT / source) as image:
        image.crop(box).save(ROOT / output, optimize=True)
        print(output, box)
