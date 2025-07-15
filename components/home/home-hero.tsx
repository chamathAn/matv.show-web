"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import {
  DotButton,
  useDotButton,
} from "@/components/sliders/EmblaCarouselDotButton";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

export default function HomeHero() {
  // carousel api
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  const [currentEmblaCard, setCurrentEmblaCard] = useState(0);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    setCurrentEmblaCard(emblaApi.selectedScrollSnap() + 1);

    emblaApi.on("select", () => {
      setCurrentEmblaCard(emblaApi.selectedScrollSnap() + 1);
    });
  }, [emblaApi]);

  // handle carousel dots
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  return (
    <section className="text-foreground w-full h-fit relative">
      {/* bg */}
      <div className="absolute bg-muted top-0 left-0 w-full h-full">
        <span className="text-3xl font-semibold">{currentEmblaCard}</span>
      </div>

      {/* content */}
      <div className="flex flex-col gap-2 items-end justify-center min-h-[80vh] z-10 relative">
        {/* carousel */}
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setEmblaApi}
          orientation="vertical"
          className="w-full max-w-xs"
        >
          <CarouselContent className="-mt-1 h-[200px] p-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="pt-1">
                <Card className="h-full">
                  <CardContent className="flex items-center justify-center h-full">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* carousel dots */}
        <div className="flex gap-x-2 ">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={cn(
                "border-foreground/15 border size-3 rounded-full ",
                {
                  "bg-accent size-3 rounded-full": index === selectedIndex,
                }
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
