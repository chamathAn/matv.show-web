import React from "react";
import futtureDevImg from "@/app/assets/futtureDevImg.png";
import Image from "next/image";

export default function FutureDevelopment() {
  return (
    <section className="relative size-full overflow-hidden text-foreground font-poppins flex justify-center items-center flex-col gap-5">
      <Image
        src={futtureDevImg}
        alt="coming soon"
        height={500}
        width={500}
        className="sm:w-1/2"
      />
      <h2 className="text-2xl lg:text-3xl font-bold">Coming soon</h2>
    </section>
  );
}
