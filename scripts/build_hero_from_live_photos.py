"""Rebuild Dank Street hero (and contact) photos from LIVE PHOTOS.

Source of truth:
  0_Input/.../DANK MEDIA KIT 2026/LIVE PHOTOS

Strategy:
  - Prefer landscape masters for the hero wash (fills wide desktop without bars).
  - Export long-edge ~2048px JPEG q78 progressive (headshot ~1200px) so
    cover-scale stays sharp without oversized downloads.
  - Never upscale past the source.
  - Misnamed HEIC (DANK STREET.jpg) is decoded via ffmpeg.
"""
from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageOps

LIVE = Path(
    r"C:\Users\lukel\OneDrive\Documents\Automation\0_Input\ArtistMarketing"
    r"\DANK STREET\DANK MEDIA KIT 2026\LIVE PHOTOS"
)
OUT = Path(__file__).resolve().parents[1] / "assets" / "img" / "photos"

def find_ffmpeg() -> Path | None:
    which = shutil.which("ffmpeg")
    if which:
        return Path(which)
    winget = Path(r"C:\Users\lukel\AppData\Local\Microsoft\WinGet\Packages")
    matches = list(winget.glob("Gyan.FFmpeg*/ffmpeg-*/bin/ffmpeg.exe"))
    return matches[0] if matches else None


FFMPEG = find_ffmpeg()

LONG_EDGE = 2048
JPEG_QUALITY = 78
HEADSHOT_LONG_EDGE = 1200

HERO = [
    ("149A9778.jpg", "live-02-otherworld.jpg"),
    ("149A9868 copy.jpg", "live-06-otherworld-2.jpg"),
    ("DANK STREET @ OTHERWORLD-37.jpg", "live-05-press.jpg"),
    ("DANK STREET @ OTHERWORLD-45.jpg", "live-03-barbary.jpg"),
    ("DANK STREET @ OTHERWORLD-20.jpg", "live-08-otherworld-20.jpg"),
    ("BARBARY.jpg", "live-09-barbary-wide.jpg"),
    ("DANK HEADSHOT copy 2.JPG", "live-01-headshot.jpg"),
    ("DANK STREET.jpg", "live-10-dank-street-portrait.jpg"),
]


def open_image(path: Path) -> Image.Image:
    try:
        im = Image.open(path)
        im.load()
        return ImageOps.exif_transpose(im)
    except Exception:
        if not FFMPEG:
            raise
        tmp = Path(tempfile.gettempdir()) / f"dank-heic-{path.stem}.jpg"
        subprocess.run(
            [str(FFMPEG), "-y", "-i", str(path), "-frames:v", "1", "-q:v", "2", str(tmp)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        im = Image.open(tmp)
        im.load()
        return ImageOps.exif_transpose(im)


def export(src_name: str, dest_name: str) -> None:
    src = LIVE / src_name
    if not src.exists():
        raise FileNotFoundError(src)
    im = open_image(src).convert("RGB")
    w, h = im.size
    long_edge = max(w, h)
    target = HEADSHOT_LONG_EDGE if "headshot" in dest_name else LONG_EDGE
    if long_edge > target:
        scale = target / long_edge
        im = im.resize((round(w * scale), round(h * scale)), Image.Resampling.LANCZOS)
    dest = OUT / dest_name
    im.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    print(f"{src_name:40} -> {dest_name:36} {im.size[0]}x{im.size[1]}  {dest.stat().st_size // 1024}KB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src, dest in HERO:
        export(src, dest)
    print("done")


if __name__ == "__main__":
    main()
