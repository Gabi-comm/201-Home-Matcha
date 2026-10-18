"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Glass from "./Glass";
import { DRINKS, DRINK_LIST, fullName, peso } from "@/lib/drinks";
import { useStore } from "@/lib/store";

/** Glass on its lit stage, plus whatever sits under it. */
export function Stage({
  draggable = false,
  children,
  className = "",
}: {
  draggable?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`stage ${className}`}>
      <Glass draggable={draggable} />
      <div className="floor" aria-hidden="true" />
      {children}
    </div>
  );
}

export function NowPlaying() {
  const { current } = useStore();
  const d = DRINKS[current];
  return (
    <div className="now" aria-live="polite">
      <b>{fullName(d)}</b>
      <span>
        {d.desc} · {peso(d.price)}
      </span>
    </div>
  );
}

export function Legend() {
  const { current } = useStore();
  return (
    <ul className="legend">
      {DRINKS[current].legend.map(([c, n]) => (
        <li key={n}>
          <i style={{ background: c }} />
          {n}
        </li>
      ))}
    </ul>
  );
}

export function Picker() {
  const { current, select } = useStore();
  return (
    <div className="picker" role="group" aria-label="Choose a drink">
      {DRINK_LIST.map((d) => (
        <button
          key={d.id}
          className="pick"
          type="button"
          aria-pressed={d.id === current}
          onClick={() => select(d.id)}
        >
          <span className="sw" aria-hidden="true">
            {d.legend
              .filter(([, n]) => n !== "ice")
              .map(([c, n]) => (
                <i key={n} style={{ background: c }} />
              ))}
          </span>
          <strong>{fullName(d)}</strong>
          <small>{peso(d.price)}</small>
        </button>
      ))}
    </div>
  );
}

export function OrderCurrent() {
  const { current, ensure } = useStore();
  return (
    <Link className="btn" href="/order" onClick={() => ensure(current)}>
      Order this <span className="arr">→</span>
    </Link>
  );
}

/** Menu rows. `full` rows pick the drink in place; teaser rows jump to the menu. */
export function Rows({ full = false }: { full?: boolean }) {
  const { current, select, bump } = useStore();
  const router = useRouter();
  return (
    <div className="rows">
      {DRINK_LIST.map((d) => {
        const on = full && d.id === current;
        return (
          <article key={d.id} className={`row${on ? " on" : ""}`}>
            <span className="dot" aria-hidden="true" />
            <button
              className="row-pick"
              type="button"
              aria-pressed={full ? on : undefined}
              aria-label={fullName(d)}
              onClick={() => {
                select(d.id);
                if (!full) router.push("/menu");
              }}
            >
              <span className="nm">
                {d.name[0]}
                <br />
                {d.name[1]}
              </span>
              <span className="meta">{d.meta}</span>
            </button>
            <p className="desc">{d.desc}</p>
            <p className="price">{peso(d.price)}</p>
            <button
              className="add"
              type="button"
              onClick={() => {
                bump(d.id, 1);
                select(d.id);
                router.push("/order");
              }}
            >
              + Add to order
            </button>
          </article>
        );
      })}
    </div>
  );
}
