import React from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardFooter } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export default function HomeRecentWatch() {
  return (
    <section className="text-foreground w-full h-fit space-y-5 pt-10 px-6 sm:px-0">
      {/* recently watched titles, and filters */}
      <div className="w-full h-fit flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex gap-4 items-center">
          <h3 className="font-roboto font-bold text-2xl text-nowrap sm:text-3xl lg:text-4xl leading-loose">
            Recently Watched
          </h3>
          <Button
            variant={"secondary"}
            className="text-xs sm:text-sm hidden md:block"
          >
            See all
          </Button>
        </div>

        <div className="flex gap-5 font-poppins h-6 text-xs sm:text-sm items-center xl:text-base">
          <h5 className="hover:underline hover:cursor-pointer">Movie</h5>

          <Separator orientation="vertical" />
          <h5 className="hover:underline hover:cursor-pointer">TV Series</h5>
          <Separator orientation="vertical" />
          <h5 className="hover:underline hover:cursor-pointer">Anime</h5>
        </div>
      </div>

      {/* recent movies */}
      <ScrollArea className="w-full rounded-md whitespace-nowrap">
        <div className="flex h-fit w-max space-x-4 pb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((movie) => (
            <Card
              key={movie}
              className="size-fit py-0 border-0 rounded-md bg-transparent"
            >
              <CardContent className=" px-0 w-32 sm:w-40 h-44 sm:h-60">
                <img
                  className="w-full h-full object-cover rounded-md "
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  alt=""
                />
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-center">
                  name goes here
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
