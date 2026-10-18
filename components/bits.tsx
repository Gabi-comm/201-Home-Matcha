import Image from "next/image";
import type { ReactNode } from "react";

/** The giant lowercase page word; letters rise in one at a time. */
export function Giant({ text, as: Tag = "h1" }: { text: string; as?: "h1" | "h2" }) {
  return (
    <Tag className="giant" aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} className="ch" aria-hidden="true" style={{ animationDelay: `${i * 55}ms` }}>
          {c === " " ? " " : c}
        </span>
      ))}
    </Tag>
  );
}

/** A photo in an arched cream frame. */
export function Arch({
  src,
  alt,
  caption,
  round = false,
  priority = false,
}: {
  src: string;
  alt: string;
  caption: ReactNode;
  round?: boolean;
  priority?: boolean;
}) {
  return (
    <figure className="arch">
      <div className={`ph${round ? " round" : ""}`}>
        <Image src={src} alt={alt} fill sizes="(min-width: 880px) 400px, 33vw" priority={priority} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** The rotating stamp beside the hero glass. */
export function Seal() {
  return (
    <div className="seal">
      <svg className="ring" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text>
          <textPath href="#circ">home matcha · iced · 12 oz · pick-up or delivery ·</textPath>
        </text>
      </svg>
      <span className="ring-core" aria-hidden="true">
        201
      </span>
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const twice = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div>
        {twice.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
