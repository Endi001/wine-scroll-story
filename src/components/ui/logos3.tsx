"use client";

import * as React from "react";
import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  /** Optional image URL. When omitted the description is rendered as a text wordmark. */
  image?: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const DEFAULT_LOGOS: Logo[] = [
  { id: "logo-1", description: "Per Se" },
  { id: "logo-2", description: "Masa" },
  { id: "logo-3", description: "The French Laundry" },
  { id: "logo-4", description: "Alinea" },
  { id: "logo-5", description: "Atelier Crenn" },
  { id: "logo-6", description: "Le Bernardin" },
  { id: "logo-7", description: "Narisawa" },
];

const Logos3 = ({
  heading = "Trusted by many restaurants",
  logos = DEFAULT_LOGOS,
  className,
}: Logos3Props) => {
  return (
    <section className={className}>
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.4em] text-muted-foreground">
          {heading}
        </p>
      </div>
      <div className="relative mt-10">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            AutoScroll({
              startDelay: 400,
              speed: 1.2,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {logos.map((logo) => (
              <CarouselItem
                key={logo.id}
                className="flex basis-1/3 items-center justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <div className="flex w-full items-center justify-center px-6">
                  {logo.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={logo.className ?? "h-7 w-auto"}
                    />
                  ) : (
                    <span
                      className={[
                        "font-display text-2xl leading-none tracking-[0.02em] text-muted-foreground",
                        "opacity-70 transition-opacity duration-500 hover:opacity-100 hover:text-accent",
                        logo.className,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {logo.description}
                    </span>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export { Logos3 };
