"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
export default function Header() {
  // handle sign in
  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL as string,
    });
  };
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    refetch();
  };

  if (error) {
    toast.error("Event has been created");
  }
  return (
    <header className="bg-background py-10 font-roboto flex flex-col container mx-auto overflow-clip">
      <div className="flex justify-between items-center">
        {/* header tilte (logo) */}
        <h1 className="text-3xl font-bold font-nebular">{"MATV SHOW"}</h1>
        {/* profile image and username */}
        {isPending ? (
          <div className="flex gap-x-5  justify-center items-center">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="w-24 h-7" />
          </div>
        ) : session ? (
          <div className="flex gap-x-5 justify-center items-center">
            <Image
              src={session?.user.image || ""}
              alt=""
              width={100}
              height={100}
              className="rounded-full w-7 h-7"
            />
            <span className="text-lg font-bold">
              {session?.user.name || ""}
            </span>
            <Button variant={"outline"} onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button variant={"outline"} onClick={handleSignIn}>
            <Icon icon="flat-color-icons:google" />
            {"Sign In With Google"}
          </Button>
        )}
      </div>
    </header>
  );
}
