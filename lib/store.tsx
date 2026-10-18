"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { DrinkId } from "./drinks";

type Qty = Record<DrinkId, number>;

type Store = {
  current: DrinkId;
  select: (id: DrinkId) => void;
  qty: Qty;
  /** Adds `delta` (clamped to 0–20) to a drink's quantity. */
  bump: (id: DrinkId, delta: number) => void;
  /** Makes sure the given drink is in the order at least once. */
  ensure: (id: DrinkId) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [current, select] = useState<DrinkId>("latte");
  const [qty, setQty] = useState<Qty>({ latte: 1, straw: 0 });

  const value = useMemo<Store>(
    () => ({
      current,
      select,
      qty,
      bump: (id, delta) =>
        setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(20, q[id] + delta)) })),
      ensure: (id) => setQty((q) => (q[id] ? q : { ...q, [id]: 1 })),
    }),
    [current, qty],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside <StoreProvider>");
  return s;
}
