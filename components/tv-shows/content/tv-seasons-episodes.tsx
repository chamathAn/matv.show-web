"use client";
import useOneTvshowDetails from "@/Hooks/useOneTvshowDetails";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StateFilter from "@/components/filter/state-filter";
import { FilterStatesType } from "@/Shared/Types/filter-states.types";
export default function TvSeasonsEpisodes() {
  const { allSeasons } = useOneTvshowDetails();
  const [episodeStates, setEpisodeStates] = useState<{
    [key: string]: FilterStatesType | "";
  }>({});

  // handle user tv show progress state
  const handleStateChange = (episodeName: string, state: FilterStatesType) => {
    setEpisodeStates((prevStates) => ({
      ...prevStates,
      [episodeName]: state,
    }));
  };

  return (
    <section className="relative mt-10 px-6 sm:px-0 font-poppins w-full flex flex-col gap-y-5 z-20 overflow-hidden text-foreground">
      {/* accordion */}
      {allSeasons &&
        allSeasons.map((season, i) => (
          <Accordion key={i} type="single" collapsible>
            <AccordionItem value={season.name}>
              <AccordionTrigger className="text-lg pl-2 sm:pl-4 bg-gradient-to-r from-accent to-transparent">
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

                        {/* user tv show progress state */}
                        <div className="mt-4">
                          <StateFilter
                            onChange={(state: string) =>
                              handleStateChange(
                                episode.name,
                                state as FilterStatesType
                              )
                            }
                          />
                        </div>
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
