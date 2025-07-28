"use client";

import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { Popover, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { PopoverContent } from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FILTER_STATES_ARRAY } from "@/Shared/Constants/filter-states.constant";
import { FilterStatesType } from "@/Shared/Types/filter-states.types";

export default function StateFilter({
  onChange,
}: {
  onChange: (state: FilterStatesType) => void;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const handleSelectedState = (state: FilterStatesType) => {
    setPopoverOpen(false);
    onChange(state);
  };
  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          size={"sm"}
          variant={"secondary"}
          className="text-xs gap-x-2 hover:bg-transparent hover:cursor-pointer border-0 px-0 font-poppins sm:text-sm xl:text-base font-medium"
        >
          <PlusCircle className="size-3 sm:size-4" />
          {"Progress State"}
        </Button>
      </PopoverTrigger>

      {/* Popeover content */}
      <PopoverContent className="w-80 border bg-background rounded-md">
        <Command className="p-4 bg-background">
          <CommandInput placeholder="Search for the state..." />
          <CommandList>
            <CommandEmpty>No state found.</CommandEmpty>
            <CommandGroup heading="States">
              {FILTER_STATES_ARRAY.map((state) => {
                return (
                  <CommandItem
                    key={state}
                    value={state}
                    onSelect={() =>
                      handleSelectedState(state as FilterStatesType)
                    }
                  >
                    {state}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
