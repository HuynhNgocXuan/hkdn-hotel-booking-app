"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import Container from "../Container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SearchInput from "../SearchInput";
import { ModeToggle } from "../theme-toggle";
import { NavMenu } from "./NavMenu";
import { Suspense } from "react";

const NavBar = () => {
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <div className="sticky top-0 border border-b-primary/10  bg-blue-300 z-50">
      <Container>
        <div className="flex justify-between items-center ">
          <div
            className="flex gap-1 items-center cursor-pointer text-2xl font-bold   transition duration-200 hover:text-teal-800 active:scale-95"
            onClick={() => router.push("/")}
          >
            <Image
              className="rounded-full mr-4"
              src="/logo.png"
              alt="Logo"
              width="50"
              height="50"
            />
            <div className="text-lg font-bold ">BOOKING HOTEL</div>
          </div>
          <Suspense fallback={<div>Loading bookings...</div>}>
            <SearchInput />
          </Suspense>
          <div className="flex gap-4 items-center">
            <div>
              <ModeToggle />
            </div>
            <UserButton />
            <NavMenu />
            {!userId && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/sign-in")}
                >
                  Sign in
                </Button>
                <Button size="sm" onClick={() => router.push("/sign-up")}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
