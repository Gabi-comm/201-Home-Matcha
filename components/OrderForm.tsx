"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Stage } from "./Drinks";
import TimeSelect, { type TimeOption } from "./TimeSelect";
import { DRINK_LIST, frameSrc, fullName, peso } from "@/lib/drinks";
import { useStore } from "@/lib/store";

type Mode = "Pick-up" | "Delivery";
type Errors = Partial<Record<"drinks" | "name" | "phone" | "addr", string>>;

const TIMES: TimeOption[] = [
  { value: "As soon as possible", hint: "Usually ready in 15 minutes" },
  { value: "In 30 minutes", hint: "We'll start whisking in a bit" },
  { value: "In 1 hour", hint: "Fresh and cold when you arrive" },
  { value: "Later today", hint: "We'll text to confirm a time" },
];
const NOTE_MAX = 160;

/** 09171234567 → "0917 123 4567" while typing. */
function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  return [d.slice(0, 4), d.slice(4, 7), d.slice(7)].filter(Boolean).join(" ");
}

const ICONS = {
  name: (
    <>
      <circle cx="10" cy="7" r="3.2" />
      <path d="M3.8 17c.9-3.2 3.3-4.8 6.2-4.8s5.3 1.6 6.2 4.8" />
    </>
  ),
  phone: (
    <>
      <rect x="5.5" y="2.5" width="9" height="15" rx="2" />
      <path d="M8.5 14.5h3" />
    </>
  ),
  addr: (
    <>
      <path d="M10 17.5s5.5-5 5.5-9.3a5.5 5.5 0 0 0-11 0c0 4.3 5.5 9.3 5.5 9.3z" />
      <circle cx="10" cy="8.2" r="2" />
    </>
  ),
  note: (
    <>
      <path d="M4 15.5V16h.5l9.3-9.3-.5-.5L4 15.5z" />
      <path d="M12.3 4.7l3 3M11.8 5.2l1.5-1.5a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-1.5 1.5" />
    </>
  ),
};

export default function OrderForm() {
  const { qty, bump, select } = useStore();
  const [mode, setMode] = useState<Mode>("Pick-up");
  const [f, setF] = useState({ name: "", phone: "", addr: "", time: TIMES[0].value, note: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");

  const del = mode === "Delivery";
  const items = DRINK_LIST.filter((d) => qty[d.id] > 0);
  const total = items.reduce((s, d) => s + qty[d.id] * d.price, 0);

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setSummary(null);
    // Clear a field's error as soon as the customer starts fixing it.
    if (k in errors) setErrors(({ [k as keyof Errors]: _, ...rest }) => rest);
  };

  const invalid = (k: keyof Errors) =>
    errors[k] ? { "aria-invalid": true, "aria-describedby": `e-${k}` } : {};

  const change = (id: (typeof DRINK_LIST)[number]["id"], delta: number) => {
    const next = Math.max(0, Math.min(20, qty[id] + delta));
    bump(id, delta);
    setSummary(null);
    const other = id === "latte" ? "straw" : "latte";
    select(next > 0 || !qty[other] ? id : other);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (!items.length) errs.drinks = "Add at least one drink.";
    if (!f.name.trim()) errs.name = "Add your name so we know whose cup it is.";
    if (f.phone.replace(/\D/g, "").length < 10) errs.phone = "Add a mobile number so we can text you when it's ready.";
    if (del && !f.addr.trim()) errs.addr = "Add an address so we know where to deliver.";
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      // Take the customer to the first problem: focus its field (or the drinks list).
      const el = document.getElementById(first === "drinks" ? "e-drinks" : `f-${first}`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      if (el instanceof HTMLInputElement) el.focus({ preventScroll: true });
      return;
    }
    const text = [
      "201 HOME MATCHA ORDER",
      ...items.map((d) => `${qty[d.id]} x ${fullName(d)} (${peso(qty[d.id] * d.price)})`),
      "Total: " + peso(total) + (del ? " + delivery fee" : ""),
      `${mode}: ${f.time}`,
      del ? "Address: " + f.addr.trim() : null,
      "Name: " + f.name.trim(),
      "Mobile: " + f.phone.trim(),
      f.note.trim() ? "Notes: " + f.note.trim() : null,
    ]
      .filter(Boolean)
      .join("\n");
    setSummary(text);
    setCopied("idle");
    requestAnimationFrame(() =>
      document.getElementById("done")?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
    );
  };

  const copy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied("copied");
      setTimeout(() => setCopied("idle"), 1600);
    } catch {
      setCopied("failed");
    }
  };


  return (
    <div className="order-grid">
      <form onSubmit={submit} noValidate>
        <fieldset>
          <legend>How do you want it?</legend>
          <div className="seg">
            {(["Pick-up", "Delivery"] as Mode[]).map((m) => (
              <span key={m} style={{ display: "contents" }}>
                <input
                  type="radio"
                  name="mode"
                  id={`m-${m}`}
                  value={m}
                  checked={mode === m}
                  onChange={() => {
                    setMode(m);
                    setSummary(null);
                  }}
                />
                <label htmlFor={`m-${m}`}>{m}</label>
              </span>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Your drinks</legend>
          <div>
            {DRINK_LIST.map((d) => (
              <div className="line" key={d.id}>
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny frame from the spin set */}
                <img src={frameSrc(d.frame)} alt="" width={52} height={69} />
                <div>
                  <strong>{fullName(d)}</strong>
                  <small>
                    {d.meta} · {peso(d.price)}
                  </small>
                </div>
                <div className="step" role="group" aria-label={`${fullName(d)} quantity`}>
                  <button type="button" onClick={() => change(d.id, -1)} aria-label="Remove one">
                    −
                  </button>
                  <output>{qty[d.id]}</output>
                  <button type="button" onClick={() => change(d.id, 1)} aria-label="Add one">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <FieldError k="drinks" msg={errors.drinks} />
        </fieldset>

        <fieldset>
          <legend>Your details</legend>
          <div className="two">
            <TextField id="f-name" label="Name" icon={ICONS.name} error={errors.name}>
              <input
                id="f-name"
                className="control"
                autoComplete="name"
                autoCapitalize="words"
                placeholder="Juan dela Cruz"
                value={f.name}
                onChange={set("name")}
                {...invalid("name")}
              />
            </TextField>
            <TextField id="f-phone" label="Mobile number" icon={ICONS.phone} error={errors.phone}>
              <input
                id="f-phone"
                className="control"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="0917 123 4567"
                maxLength={13}
                value={f.phone}
                onChange={(e) => set("phone")({ target: { value: formatPhone(e.target.value) } })}
                {...invalid("phone")}
              />
            </TextField>
          </div>
          {del && (
            <TextField id="f-addr" label="Delivery address" icon={ICONS.addr} error={errors.addr}>
              <input
                id="f-addr"
                className="control"
                autoComplete="street-address"
                placeholder="House no., street, barangay, city"
                value={f.addr}
                onChange={set("addr")}
                {...invalid("addr")}
              />
            </TextField>
          )}
          <TimeSelect
            id="f-time"
            label={del ? "Delivery time" : "Pick-up time"}
            options={TIMES}
            value={f.time}
            onChange={(v) => set("time")({ target: { value: v } })}
          />
          <TextField
            id="f-note"
            label="Notes"
            optional
            icon={ICONS.note}
            aside={`${f.note.length}/${NOTE_MAX}`}
          >
            <textarea
              id="f-note"
              className="control"
              rows={3}
              maxLength={NOTE_MAX}
              placeholder="Less ice, extra jam…"
              value={f.note}
              onChange={set("note")}
            />
          </TextField>
        </fieldset>

        <button className="btn" type="submit">
          Review order <span className="arr">→</span>
        </button>
      </form>

      <aside className="ticket" aria-live="polite">
        <Stage className="pour" draggable />
        <div className="in">
          <p className="eyebrow">{mode}</p>
          <h3>your cup.</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {items.length ? (
              items.map((d) => (
                <div className="tl" key={d.id}>
                  <span>
                    {qty[d.id]} × {fullName(d)}
                  </span>
                  <span>{peso(qty[d.id] * d.price)}</span>
                </div>
              ))
            ) : (
              <p className="fine">No drinks yet.</p>
            )}
          </div>
          <div className="total">
            <span>Total</span>
            <b>{peso(total)}</b>
          </div>
          {summary && (
            <div className="done" id="done">
              <pre>{summary}</pre>
              <button className="btn" type="button" onClick={copy}>
                {copied === "copied" ? "Copied" : "Copy order"}
              </button>
              {copied === "failed" && <p className="fine">Couldn&apos;t reach the clipboard. Select the text above and copy it.</p>}
              <p className="fine">Orders aren&apos;t sent anywhere yet. Copy this and message it to us.</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

/** Label row + outlined control with a leading icon + error line. */
function TextField({
  id,
  label,
  icon,
  error,
  optional = false,
  aside,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  optional?: boolean;
  aside?: string;
  children: ReactNode;
}) {
  return (
    <div className={`field${error ? " has-err" : ""}`}>
      <div className="field-head">
        <label className="field-label" htmlFor={id}>
          {label}
          {optional && <em> · optional</em>}
        </label>
        {aside && (
          <span className="field-aside" aria-hidden="true">
            {aside}
          </span>
        )}
      </div>
      <div className="control-wrap">
        <svg className="ico" viewBox="0 0 20 20" aria-hidden="true">
          {icon}
        </svg>
        {children}
      </div>
      {error ? (
        <p className="err" id={`e-${id.slice(2)}`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FieldError({ k, msg }: { k: keyof Errors; msg?: string }) {
  return msg ? (
    <p className="err" id={`e-${k}`} role="alert">
      {msg}
    </p>
  ) : (
    <span id={`e-${k}`} hidden />
  );
}
