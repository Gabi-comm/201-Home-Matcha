"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/", label: "Home", short: "Home" },
  { href: "/menu", label: "Menu", short: "Menu" },
  { href: "/story", label: "Our story", short: "Story" },
  { href: "/order", label: "Order", short: "Order" },
];

export function Logo({ label = "201 home matcha, home" }: { label?: string }) {
  return (
    <Link className="logo" href="/" aria-label={label}>
      <span className="n">201</span>
      <span className="w">
        <span>home</span>
        <span>matcha</span>
      </span>
    </Link>
  );
}

function useCurrent() {
  const path = usePathname();
  return (href: string) => (href === "/" ? path === "/" : path.startsWith(href)) ? "page" : undefined;
}

export function Header() {
  const current = useCurrent();
  return (
    <header className="top">
      <div className="wrap">
        <Logo />
        <nav className="desk-nav" aria-label="Pages">
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} aria-current={current(p.href)}>
              {p.label}
            </Link>
          ))}
        </nav>
        <span className="status">
          <i />
          Taking orders
        </span>
        <Link className="btn" href="/order">
          Order now <span className="arr">→</span>
        </Link>
      </div>
    </header>
  );
}

export function TabBar() {
  const current = useCurrent();
  return (
    <nav className="tabbar" aria-label="Pages">
      <ul>
        {PAGES.map((p) => (
          <li key={p.href}>
            <Link href={p.href} aria-current={current(p.href)}>
              {p.short}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
