export type DrinkId = "latte" | "straw";

export type Drink = {
  id: DrinkId;
  name: [string, string];
  meta: string;
  desc: string;
  price: number;
  /** Frame of the Blender spin (0-based) that shows this drink, facing front. */
  frame: number;
  legend: [color: string, label: string][];
};

/** The Blender render: 48 frames, one full turn while the strawberry jam pours in. */
export const FRAME_COUNT = 48;
export const FRAME_FPS = 32;
export const frameSrc = (i: number) => `/glass/${String(i + 1).padStart(2, "0")}.webp`;

export const DRINKS: Record<DrinkId, Drink> = {
  latte: {
    id: "latte",
    name: ["Matcha", "Latte"],
    meta: "iced | 12 oz.",
    desc: "matcha & milk",
    price: 100,
    frame: 0,
    legend: [
      ["#93ad4c", "matcha"],
      ["#e8e0d2", "milk"],
      ["#cfd6c4", "ice"],
    ],
  },
  straw: {
    id: "straw",
    name: ["Strawberry", "Matcha Latte"],
    meta: "iced | 12 oz.",
    desc: "matcha, milk, strawberry jam",
    price: 115,
    frame: FRAME_COUNT - 1,
    legend: [
      ["#93ad4c", "matcha"],
      ["#e8e0d2", "milk"],
      ["#c65a62", "strawberry jam"],
      ["#cfd6c4", "ice"],
    ],
  },
};

export const DRINK_LIST = Object.values(DRINKS);

export const fullName = (d: Drink) => d.name.join(" ");

export const peso = (n: number) =>
  "PHP " + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
