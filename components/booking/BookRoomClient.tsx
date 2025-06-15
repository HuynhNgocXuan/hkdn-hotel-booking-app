"use client";

import useBookRoom from "@/hooks/useBookRoom";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import RoomCard from "../room/RoomCard";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import RoomPaymentForm from "./RoomPaymentForm";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const BookRoomClient = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { bookingRoomData, clientSecret } = useBookRoom();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const option: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: theme === "dark" ? "night" : "stripe",
    },
  };

  const handleSetPaymentSuccess = (value: boolean) => {
    setPaymentSuccess(value);
  };

  if (pageLoaded && !paymentSuccess && (!bookingRoomData || !clientSecret))
    return (
      <div className="flex items-center flex-col gap-4">
        <div className="text-rose-500">
          Oops! This page could not be properly loaded...
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            Go Home
          </Button>
          <Button onClick={() => router.push("/my-bookings")}>
            View My Bookings
          </Button>
        </div>
      </div>
    );

  if (paymentSuccess)
    return (
      <div className="flex items-center flex-col gap-4">
        <div className="text-teal-500 text-center">Payment Success</div>
        <Button onClick={() => router.push("/my-bookings")}>
          View Bookings
        </Button>
      </div>
    );

  return (
    <div>
      <h3 className="text-2xl font-bold mb-12 text-center ">
        Complete payment to reserve this room
      </h3>
      {bookingRoomData && clientSecret && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="mb-8 flex flex-1 flex-col gap-6">
            <RoomCard room={bookingRoomData.room} />
          </div>
          <div className="flex flex-1/4 flex-col gap-6">
            <Elements stripe={stripePromise} options={option}>
              <RoomPaymentForm
                clientSecret={clientSecret}
                handleSetPaymentSuccess={handleSetPaymentSuccess}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRoomClient;
