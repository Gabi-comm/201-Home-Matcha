import type { Metadata } from "next";
import Link from "next/link";
import { Arch, Giant } from "@/components/bits";

export const metadata: Metadata = { title: "Our story" };

const STEPS = [
  ["Sift", "Matcha is sifted first so there are no clumps in your cup."],
  ["Whisk", "Whisked by hand in a zig-zag until it turns smooth and frothy."],
  ["Layer", "Jam at the bottom, cold milk and ice, then the matcha poured on top."],
  ["Hand off", "Sealed and ready for pick-up, or out the door for delivery."],
];

export default function StoryPage() {
  return (
    <section className="page" aria-label="Our story">
      <div className="wrap">
        <div className="story-head">
          <p className="eyebrow">Our story</p>
          <Giant text="at home." />
        </div>
        <div className="story-grid">
          <div style={{ display: "grid", gap: 24, minWidth: 0 }}>
            <p className="pull">A small matcha bar that runs out of a home kitchen, one cup at a time.</p>
            <p className="lede">
              We keep the menu short so every drink gets the same attention. No syrups, no shortcuts. Just good
              matcha, cold milk and a little jam when you want it sweet.
            </p>
            <div className="duo">
              <Arch src="/img/whisk-drip.webp" alt="Matcha dripping from a bamboo whisk" caption="The chasen" />
              <Arch src="/img/bowl.webp" alt="Bamboo whisk in a bowl of frothy matcha" caption="Froth, top down" round />
            </div>
          </div>
          <ol className="steps">
            {STEPS.map(([h, p], i) => (
              <li key={h}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <div>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="btns" style={{ marginTop: 34 }}>
          <Link className="btn" href="/order">
            Order a cup <span className="arr">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
