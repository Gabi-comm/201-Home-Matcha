# Fades the shadow-catcher shadow out towards the frame edges so the transparent
# frames don't show a box on the page. Only touches pure-black (shadow) pixels.
#   blender -b --python blender/fade_shadow.py -- <in_dir> <out_dir>
import sys, os
import bpy
import numpy as np

src, dst = sys.argv[sys.argv.index("--") + 1:][:2]
os.makedirs(dst, exist_ok=True)

for name in sorted(f for f in os.listdir(src) if f.endswith(".webp")):
    im = bpy.data.images.load(os.path.join(src, name), check_existing=False)
    w, h = im.size
    px = np.empty(w * h * 4, dtype=np.float32)
    im.pixels.foreach_get(px)
    px = px.reshape(h, w, 4)  # row 0 is the bottom of the image

    ys, xs = np.mgrid[0:h, 0:w]
    cx, cy = w * 0.5, h * 0.105          # just under the glass base
    d = ((xs - cx) / (w * 0.40)) ** 2 + ((ys - cy) / (h * 0.11)) ** 2
    fall = np.clip(1.0 - (d - 0.35) / 0.65, 0.0, 1.0)
    fall = fall * fall * (3 - 2 * fall)  # smoothstep

    shadow = px[..., :3].max(axis=2) < 0.004
    px[..., 3] = np.where(shadow, px[..., 3] * fall, px[..., 3])

    im.pixels.foreach_set(px.ravel())
    im.filepath_raw = os.path.join(dst, name)
    im.file_format = "WEBP"
    bpy.context.scene.render.image_settings.quality = 86
    im.save()
    bpy.data.images.remove(im)
    print("faded", name)
