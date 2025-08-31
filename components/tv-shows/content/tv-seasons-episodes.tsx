"use client";
import useOneTvshowDetails from "@/Hooks/useOneTvshowDetails";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Rating } from "@fluentui/react-rating";
import { Button } from "@/components/ui/button";
export default function TvSeasonsEpisodes() {
  const { allSeasons } = useOneTvshowDetails();
  const [userRating, setUserRating] = useState<{ [key: string]: number }>({});

  // handle rating
  const handleRatingChange = (episodeName: string, value: number) => {
    setUserRating((prevRatings) => ({
      ...prevRatings,
      [episodeName]: value,
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

                        {/* give your rating */}
                        <div className="flex gap-5 items-center mt-5">
                          <Rating
                            value={userRating[episode.name] || 0}
                            onChange={(_, data) =>
                              handleRatingChange(episode.name, data.value)
                            }
                          />
                          <Button variant="secondary">Rate</Button>
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
