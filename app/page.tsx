import Image from "next/image";
import Link from "next/link";
import { Arch, Giant, Marquee, Seal } from "@/components/bits";
import { NowPlaying, OrderCurrent, Picker, Rows, Stage } from "@/components/Drinks";

const WAYS = [
  {
    title: "Pick-up",
    body: "Order ahead and grab it fresh from our home.",
    icon: (
      <>
        <path d="M6 12h20l-2 15H8z" />
        <path d="M11 12a5 5 0 0 1 10 0" />
      </>
    ),
  },
  {
    title: "Delivery",
    body: "Brought to your door, still iced.",
    icon: (
      <>
        <circle cx="9" cy="23" r="4" />
        <circle cx="24" cy="23" r="4" />
        <path d="M9 23l5-10h6l4 10M14 13l-2-4H8M20 13h4" />
      </>
    ),
  },
  {
    title: "12 oz.",
    body: "Every drink is iced and served in a 12 oz. cup.",
    icon: (
      <>
        <path d="M8 5h16l-2 23H10z" />
        <path d="M9 11h14" />
        <rect x="12" y="15" width="4" height="4" rx="1" />
        <rect x="17" y="18" width="4" height="4" rx="1" />
      </>
    ),
  },
  {
    title: "Simple",
    body: "Matcha, milk and, if you like, strawberry jam.",
    icon: (
      <>
        <path d="M16 4c-4 6-8 9-8 15a8 8 0 0 0 16 0c0-6-4-9-8-15z" />
        <path d="M12 20a4 4 0 0 0 4 4" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <section className="page" aria-label="Home">
      <div className="wrap">
        <div className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Home-whisked · iced · 12 oz.</p>
            <Giant text="matcha" />
            <p className="lede">Pick your cup.</p>
            <Picker />
            <div className="btns">
              <OrderCurrent />
              <Link className="btn ghost" href="/menu">
                See the menu
              </Link>
            </div>
          </div>
          <Stage draggable>
            <Seal />
            <NowPlaying />
          </Stage>
        </div>

        <div className="strip">
          <Arch src="/img/pour.webp" alt="Matcha pouring into an iced glass" caption="Poured over ice" />
          <Arch src="/img/whisk-drip.webp" alt="Matcha dripping from a bamboo whisk" caption="Whisked by hand" />
          <Arch src="/img/bowl.webp" alt="Bamboo whisk resting in a bowl of frothy matcha" caption="Frothed to order" />
        </div>
      </div>

      <Marquee items={["Matcha latte", "Strawberry matcha latte", "Iced · 12 oz.", "Pick-up or delivery"]} />

      <div className="wrap">
        <div className="section">
          <div className="section-head">
            <h2 className="h2">the two.</h2>
            <Link className="text-link" href="/menu">
              Full menu →
            </Link>
          </div>
          <Rows />
        </div>
        <div className="section">
          <h2 className="h2">how it gets to you.</h2>
          <div className="swirl-band">
            <div className="swirl">
              <Image src="/img/swirl.webp" alt="Milk swirling into iced matcha" fill sizes="(min-width: 880px) 520px, 100vw" />
              <p>Milk meets matcha</p>
            </div>
            <div className="ways">
              {WAYS.map((w) => (
                <div className="way" key={w.title}>
                  <svg viewBox="0 0 32 32" aria-hidden="true">
                    {w.icon}
                  </svg>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
