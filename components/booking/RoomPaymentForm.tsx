"use client";

import useBookRoom from "@/hooks/useBookRoom";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import moment from "moment";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { Booking } from "@prisma/client";

interface RoomPaymentFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

type DateRangesType = {
  startDate: Date;
  endDate: Date;
};

function hasOverlap(
  startDate: Date,
  endDate: Date,
  dateRanges: DateRangesType[]
) {
  const targetInterval = {
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate)),
  };

  for (const range of dateRanges) {
    const rangeStart = startOfDay(new Date(range.startDate));
    const rangeEnd = endOfDay(new Date(range.endDate));

    if (
      isWithinInterval(targetInterval.start, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      isWithinInterval(targetInterval.end, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      (targetInterval.start < rangeStart && targetInterval.end > rangeEnd)
    ) {
      return true;
    }
  }

  return false;
}

const RoomPaymentForm = ({
  clientSecret,
  handleSetPaymentSuccess,
}: RoomPaymentFormProps) => {
  const { bookingRoomData, resetBookingData } = useBookRoom();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!stripe || !clientSecret) return;

    handleSetPaymentSuccess(false);
    setIsLoading(false);
  }, [stripe]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements || !bookingRoomData) {
      return;
    }

    try {
      const bookings =  await axios.get(`/api/booking/${bookingRoomData.room.id}`);

      const roomBookingDates = bookings.data.map((booking: Booking) => {
        return {
          startDate: booking.startDate,
          endDate: booking.endDate,
        };
      });

      const overlapFound = hasOverlap(
        bookingRoomData.checkInDate,
        bookingRoomData.checkOutDate,
        roomBookingDates
      );

      if (overlapFound) {
        setIsLoading(false);
        return toast.warning(
          "Oops! Some of the days you are trying to book have already been reserved. Please go back and select different dates or rooms"
        );
      }

      await stripe
        .confirmPayment({ elements, redirect: "if_required" })
        .then((result) => {
          if (!result.error) {
            axios
              .patch(`/api/booking/${result.paymentIntent.id}`)
              .then(() => {
                toast.success("🎉 Room Reserved!");
                router.refresh();
                resetBookingData();
                handleSetPaymentSuccess(true);
                setIsLoading(false);
              })
              .catch((error) => {
                console.log("PATCH error:", error);

                const errorMessage =
                  error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong";

                toast.error(errorMessage);
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  if (!bookingRoomData?.checkInDate || !bookingRoomData?.checkOutDate) {
    return <div>Error: Missing reservation dates...</div>;
  }

  const startDate = moment(bookingRoomData?.checkInDate).format("MMMM Do YYYY");
  const endDate = moment(bookingRoomData?.checkOutDate).format("MMMM Do YYYY");

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>
      <AddressElement
        options={{
          mode: "billing",
        }}
      />

      <h2 className="font-semibold mt-4 mb-2 text-lg">Payment Information</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      <div className="flex flex-col gap-1 my-6">
        <hr />
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold mb-1 text-lg">Your Booking Summary</h2>
          <div>
            You will check-in on{" "}
            <span className="font-semibold">{startDate}</span> at 5PM
          </div>
          <div>
            You will check-out on{" "}
            <span className="font-semibold">{endDate}</span> at 5PM
          </div>
          {bookingRoomData?.breakFastIncluded && (
            <div>You will be served breakfast each day at 8AM</div>
          )}
        </div>
        <hr />
      </div>
      <div className="font-bold text-lg my-8">
        {bookingRoomData?.breakFastIncluded && (
          <div className="mb-2">
            Breakfast Price: ${bookingRoomData.room.breakFastPrice} /day
          </div>
        )}
        Total Price: ${bookingRoomData?.totalPrice}
      </div>
      {isLoading && (
        <Alert className="text-white bg-indigo-400 my-8">
          <Terminal className="h-4 w-4 stroke-white" />
          <AlertTitle>Processing!</AlertTitle>
          <AlertDescription className="text-white">
            Please stay on this page as we process your payment🔥
          </AlertDescription>
        </Alert>
      )}
      <Button disabled={isLoading}>
        {isLoading ? "Processing Payment... " : "Pay Now"}
      </Button>
    </form>
  );
};

export default RoomPaymentForm;
