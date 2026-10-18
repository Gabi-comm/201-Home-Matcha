import type { Metadata } from "next";
import { Giant } from "@/components/bits";
import OrderForm from "@/components/OrderForm";

export const metadata: Metadata = { title: "Order" };

export default function OrderPage() {
  return (
    <section className="page" aria-label="Order">
      <div className="wrap">
        <div className="order-head">
          <p className="eyebrow">Pick-up or delivery</p>
          <Giant text="order" />
        </div>
        <OrderForm />
      </div>
    </section>
  );
}
