# 201 Home Matcha

Website for a home matcha bar: Home, Menu, Our story and Order (pick-up or delivery).
Next.js 16 (App Router), React 19, plain CSS. No backend yet: the order page builds a
text summary the customer copies and messages over.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## The 3D glass

The glass is a real Blender (Cycles) render, not WebGL: 48 transparent frames of one full
turn while the strawberry jam pours in. Frame 1 is the Matcha Latte, frame 48 the
Strawberry Matcha Latte. `components/Glass.tsx` plays the frames on a canvas when the drink
changes, and on the Home, Menu and Order pages you can drag the glass to turn it.

Source: `blender/201-matcha-glass-v2.blend` (the original model, plus condensation beads,
two more ice cubes, frosted ice and a frothy top).

To re-render:

```bash
# 1. render 48 frames to blender/render/ (GPU)
blender -b blender/201-matcha-glass-v2.blend -a
# 2. fade the shadow-catcher shadow toward the frame edges (otherwise a faint box shows)
blender -b --python blender/fade_shadow.py -- blender/render blender/render-faded
# 3. copy into public/glass/01.webp … 48.webp
npm run frames
```

Drink data (names, prices, which frame shows each drink) lives in `lib/drinks.ts`.
