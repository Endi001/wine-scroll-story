"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";

const WINE_NAME = "Cuvée Noir 2019";
const UNIT_PRICE = 48;
const DISCOUNT_RATE = 0.05;
const PHONE_HREF = "tel:+33556001234";

const currency = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function BulkCalculator() {
  const [quantity, setQuantity] = useState(25);

  const { subtotal, discount, total } = useMemo(() => {
    const subtotal = quantity * UNIT_PRICE;
    const discount = subtotal * DISCOUNT_RATE;
    return { subtotal, discount, total: subtotal - discount };
  }, [quantity]);

  return (
    <section className="relative border-t border-border/40 py-32">
      <div className="mx-auto max-w-3xl px-6">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-accent">
          Bulk orders
        </p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
          Order by the case. <span className="italic text-accent">Save on every bottle.</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          A flat 5% off all bulk orders of our estate cuvée. Slide to size your
          order — totals update as you go.
        </p>

        <div className="mt-14 rounded-sm border border-border/60 bg-card/40 p-8 sm:p-10 animate-fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Estate cuvée
          </p>
          <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            {WINE_NAME}
          </h2>

          <div className="mt-10">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="qty"
                className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
              >
                Quantity
              </label>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-accent">
                  {quantity}
                </span>
                <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  bottles
                </span>
              </div>
            </div>
            <Slider
              id="qty"
              className="mt-6"
              min={10}
              max={100}
              step={1}
              value={[quantity]}
              onValueChange={(v) => setQuantity(v[0] ?? 10)}
            />
            <div className="mt-2 flex justify-between text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground/70">
              <span>10</span>
              <span>100</span>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-border/40 pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                You pay
              </p>
              <p className="mt-2 font-display text-5xl text-accent sm:text-6xl">
                {currency.format(total)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              You save{" "}
              <span className="text-accent">{currency.format(discount)}</span>{" "}
              with the bulk discount.
            </p>
          </div>

          <dl className="mt-10 divide-y divide-border/40 border-y border-border/40 text-sm">
            <Row label="Wine" value={WINE_NAME} />
            <Row label="Unit price" value={currency.format(UNIT_PRICE)} />
            <Row label="Quantity" value={`${quantity} bottles`} />
            <Row label="Subtotal" value={currency.format(subtotal)} />
            <Row
              label="Bulk discount (5%)"
              value={`− ${currency.format(discount)}`}
              accent
            />
            <Row label="Total" value={currency.format(total)} emphasize />
          </dl>

          <a
            href={PHONE_HREF}
            className="group mt-10 inline-flex items-center gap-3 border border-accent/70 bg-transparent px-8 py-4 text-xs uppercase tracking-[0.35em] text-accent transition-all hover:bg-accent hover:text-accent-foreground"
          >
            Call us to order
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  emphasize,
  accent,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </dt>
      <dd
        className={
          emphasize
            ? "font-display text-2xl text-foreground"
            : accent
              ? "text-accent"
              : "text-foreground"
        }
      >
        {value}
      </dd>
    </div>
  );
}
