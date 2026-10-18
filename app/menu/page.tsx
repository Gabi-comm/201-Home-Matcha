import type { Metadata } from "next";
import { Giant } from "@/components/bits";
import { Legend, Rows, Stage } from "@/components/Drinks";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  return (
    <section className="page" aria-label="Menu">
      <div className="wrap">
        <div className="menu-head">
          <Giant text="menu" />
        </div>
        <div className="menu-layout">
          <div>
            <Rows full />
            <p className="pickup-note">PICK-UP OR DELIVERY</p>
          </div>
          <Stage draggable>
            <Legend />
          </Stage>
        </div>
      </div>
    </section>
  );
}
