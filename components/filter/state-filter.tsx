import { PlusCircle } from "lucide-react";
import React from "react";
import { Popover, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

export default function StateFilter() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={"sm"}
          variant={"secondary"}
          className="text-xs gap-x-2 border-0 px-0 font-poppins sm:text-sm xl:text-base font-medium"
        >
          <PlusCircle className="size-3 sm:size-4" />
          {"Progress State"}
        </Button>
      </PopoverTrigger>
    </Popover>
  );
}
