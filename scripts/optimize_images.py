#!/usr/bin/env python3
"""
WEG Events — Automated Image Optimizer
Optimizes JPG, JPEG, and PNG images in the images/ directory:
1. Corrects EXIF orientation (e.g. from camera/phone uploads)
2. Resizes images larger than 2000px down to 2000px (retina-ready for luxury display)
3. Generates high-efficiency WebP variants (quality=82)
4. Optimizes original JPG/PNG files in-place (progressive, stripped metadata)
5. Skips already-optimized images unless source is newer or --force is specified
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Pillow is required for image optimization. Run: pip install Pillow")
    sys.exit(1)

MAX_DIMENSION = 2000  # Max width or height in pixels
WEBP_QUALITY = 82     # Perceptually lossless quality for photography
JPEG_QUALITY = 85     # Fallback JPG quality
SUPPORTED_EXTS = {".jpg", ".jpeg", ".png"}

def optimize_image(img_path: Path, force: bool = False):
    webp_path = img_path.with_suffix(".webp")
    
    # Check if we should skip
    needs_webp = force or not webp_path.exists() or (img_path.stat().st_mtime > webp_path.stat().st_mtime)
    
    orig_size = img_path.stat().st_size
    if orig_size == 0:
        return None
        
    try:
        with Image.open(img_path) as im:
            # Normalize orientation from phone/DSLR EXIF tag
            im = ImageOps.exif_transpose(im)
            
            # Check dimensions and resize if too large
            w, h = im.size
            resized = False
            if max(w, h) > MAX_DIMENSION:
                im.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
                resized = True
            
            # Generate WebP variant
            if needs_webp:
                # WebP supports RGBA (PNG with transparency) and RGB
                if im.mode not in ("RGB", "RGBA"):
                    conv_im = im.convert("RGBA" if "transparency" in im.info or im.mode == "LA" else "RGB")
                else:
                    conv_im = im
                conv_im.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
                webp_size = webp_path.stat().st_size
            else:
                webp_size = webp_path.stat().st_size
                
            # If resized or original is very large, optimize the source image too
            if resized or orig_size > 500 * 1024:
                if img_path.suffix.lower() in (".jpg", ".jpeg"):
                    rgb_im = im.convert("RGB")
                    rgb_im.save(img_path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
                elif img_path.suffix.lower() == ".png":
                    im.save(img_path, "PNG", optimize=True)
            
            new_orig_size = img_path.stat().st_size
            
            return {
                "file": img_path.name,
                "orig_size": orig_size,
                "new_orig_size": new_orig_size,
                "webp_size": webp_size,
                "resized": resized,
                "new_dim": im.size
            }
    except Exception as e:
        print(f"⚠️ Error processing {img_path}: {e}")
        return None

def main():
    force = "--force" in sys.argv
    root_dir = Path(__file__).resolve().parent.parent
    images_dir = root_dir / "images"
    
    if not images_dir.exists():
        print(f"Directory {images_dir} does not exist.")
        return
        
    print("=" * 60)
    print("🌸 WEG Events — Image Optimization Sweep")
    print("=" * 60)
    
    image_files = [
        p for p in images_dir.rglob("*")
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS and not p.name.startswith(".")
    ]
    
    if not image_files:
        print("No JPG or PNG images found in images/ directory.")
        return
        
    total_orig = 0
    total_webp = 0
    processed_count = 0
    
    for img_path in sorted(image_files):
        res = optimize_image(img_path, force=force)
        if res:
            total_orig += res["orig_size"]
            total_webp += res["webp_size"]
            savings_pct = ((res["orig_size"] - res["webp_size"]) / res["orig_size"]) * 100
            orig_kb = res["orig_size"] / 1024
            webp_kb = res["webp_size"] / 1024
            dim_str = f"({res['new_dim'][0]}x{res['new_dim'][1]})"
            print(f"✓ {res['file'][:32]:<32} {orig_kb:>7.1f} KB -> {webp_kb:>7.1f} KB WebP ({savings_pct:>5.1f}% smaller) {dim_str}")
            processed_count += 1
            
    print("-" * 60)
    if total_orig > 0:
        total_saved_mb = (total_orig - total_webp) / (1024 * 1024)
        total_saved_pct = ((total_orig - total_webp) / total_orig) * 100
        print(f"✨ Successfully optimized {processed_count} images!")
        print(f"   Original Total:  {total_orig / (1024*1024):.2f} MB")
        print(f"   WebP Total:      {total_webp / (1024*1024):.2f} MB")
        print(f"   Bandwidth Saved: {total_saved_mb:.2f} MB ({total_saved_pct:.1f}% reduction)")
    print("=" * 60)

if __name__ == "__main__":
    main()
