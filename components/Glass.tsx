"use client";

import { useEffect, useRef, useState } from "react";
import { DRINKS, FRAME_COUNT, FRAME_FPS, frameSrc, fullName } from "@/lib/drinks";
import { useStore } from "@/lib/store";

const W = 720;
const H = 960;

/* One shared set of decoded frames for every glass on the page. */
let frames: HTMLImageElement[] | null = null;
let ready: Promise<void> | null = null;
function loadFrames() {
  if (!ready) {
    frames = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const im = new Image();
      im.decoding = "async";
      im.src = frameSrc(i);
      return im;
    });
    ready = Promise.all(frames.map((im) => im.decode().catch(() => {}))).then(() => {});
  }
  return ready;
}

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

type Props = {
  /** Lets people drag sideways to turn the glass (and watch the jam pour). */
  draggable?: boolean;
  className?: string;
};

export default function Glass({ draggable = false, className = "" }: Props) {
  const { current } = useStore();
  const drink = DRINKS[current];
  const canvas = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [turning, setTurning] = useState(false);
  const anim = useRef({ at: drink.frame, to: drink.frame, raf: 0, last: 0 });
  const drag = useRef<{ x: number; from: number } | null>(null);

  const draw = (i: number) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !frames) return;
    // A frame that failed to load must not freeze the spin: show the nearest one that did.
    const want = Math.round(i);
    let im: HTMLImageElement | undefined;
    for (let d = 0; d < FRAME_COUNT && !im; d++) {
      im = [frames[want - d], frames[want + d]].find((f) => f?.naturalWidth);
    }
    if (!im) return;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(im, 0, 0, W, H);
  };

  const play = (to: number) => {
    const a = anim.current;
    a.to = to;
    if (reducedMotion()) {
      a.at = to;
      draw(to);
      return;
    }
    if (a.raf) return;
    setTurning(true);
    a.last = 0;
    const step = (t: number) => {
      if (!a.last) a.last = t;
      const n = ((t - a.last) / 1000) * FRAME_FPS;
      a.last = t;
      a.at = a.to > a.at ? Math.min(a.to, a.at + n) : Math.max(a.to, a.at - n);
      draw(a.at);
      if (a.at === a.to) {
        a.raf = 0;
        setTurning(false);
        return;
      }
      a.raf = requestAnimationFrame(step);
    };
    a.raf = requestAnimationFrame(step);
  };

  useEffect(() => {
    let live = true;
    loadFrames().then(() => {
      if (!live) return;
      draw(anim.current.at);
      setLoaded(true);
    });
    const a = anim.current;
    return () => {
      live = false;
      cancelAnimationFrame(a.raf);
      a.raf = 0;
    };
  }, []);

  useEffect(() => {
    if (loaded) play(drink.frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, loaded]);

  const onDown = (e: React.PointerEvent) => {
    if (!draggable || !loaded) return;
    cancelAnimationFrame(anim.current.raf);
    anim.current.raf = 0;
    drag.current = { x: e.clientX, from: anim.current.at };
    (e.target as Element).setPointerCapture(e.pointerId);
    setTurning(true);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const at = Math.max(0, Math.min(FRAME_COUNT - 1, drag.current.from + dx / 6));
    anim.current.at = at;
    draw(at);
  };
  const onUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setTurning(false);
    play(drink.frame);
  };

  return (
    <div
      className={`glass${loaded ? " ready" : ""}${turning ? " turning" : ""}${draggable ? " drag" : ""} ${className}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- poster frame shown until the canvas is ready */}
      <img
        src={frameSrc(drink.frame)}
        width={W}
        height={H}
        alt={`Iced ${fullName(drink).toLowerCase()} in a clear 201 glass`}
        draggable={false}
      />
      <canvas ref={canvas} width={W} height={H} aria-hidden="true" />
    </div>
  );
}
