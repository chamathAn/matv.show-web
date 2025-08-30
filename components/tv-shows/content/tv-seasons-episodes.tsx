"use client";
import useOneTvshowDetails from "@/Hooks/useOneTvshowDetails";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function TvSeasonsEpisodes() {
  const { allSeasons } = useOneTvshowDetails();
  return (
    <section className="relative mt-10 px-6 sm:px-0 font-poppins w-full flex flex-col gap-y-5 z-20 overflow-hidden text-foreground">
      {/* accordion */}
      {allSeasons &&
        allSeasons.map((season, i) => (
          <Accordion key={i} type="single" collapsible>
            <AccordionItem value={season.name}>
              <AccordionTrigger className="text-lg bg-gradient-to-r from-accent to-transparent">
                {season.name}
              </AccordionTrigger>
              <AccordionContent>
                {/* episodes */}
                <Accordion type="multiple" className="ml-10">
                  {season.episodes.map((episode, i) => (
                    <AccordionItem key={i} value={episode.name}>
                      <AccordionTrigger>{episode.name}</AccordionTrigger>
                      <AccordionContent>
                        <p>{episode.overview}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
    </section>
  );
}
