"use client";

import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  MapPin,
  Ship,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  Volume,
  Wifi,
} from "lucide-react";
import React, { useState } from "react";

import { toast } from "sonner";
import { differenceInCalendarDays } from "date-fns";
import useBookRoom from "@/hooks/useBookRoom";
import useLocation from "@/hooks/useLocation";
import moment from "moment";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface MyBookingClientProps {
  booking: Booking & { Room: Room | null } & { Hotel: Hotel | null };
}

const MyBookingClient: React.FC<MyBookingClientProps> = ({ booking }) => {
  const { setClientSecret, setPaymentIntentId, setRoomData, paymentIntentId } =
    useBookRoom();
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const { getCountryByCode, getStateByCode } = useLocation();
  const { Hotel, Room } = booking;
  const { userId } = useAuth();
  const router = useRouter();
  
  const startDate = moment(booking.startDate).format("MMMM Do YYYY");
  const endDate = moment(booking.endDate).format("MMMM Do YYYY");

  const dayCount = differenceInCalendarDays(booking.endDate, booking.startDate);

  if (!Hotel || !Room) return <div>Hotel or Room info missing!</div>;
  
  const country = getCountryByCode(Hotel.country);
  const state = getStateByCode(Hotel.country, Hotel.state);


  const amenities = [
    {
      show: true,
      icon: <Bed className="h-4 w-4" />,
      label: `${Room.bedCount} Bed(s)`,
    },
    {
      show: true,
      icon: <Users className="h-4 w-4" />,
      label: `${Room.guestCount} Guest(s)`,
    },
    {
      show: true,
      icon: <Bath className="h-4 w-4" />,
      label: `${Room.bathroomCount} Bathroom(s)`,
    },
    {
      show: !!Room.kingBed,
      icon: <BedDouble className="h-4 w-4" />,
      label: `${Room.kingBed} King Bed(s)`,
    },
    {
      show: !!Room.queenBed,
      icon: <Bed className="h-4 w-4" />,
      label: `${Room.queenBed} Queen Bed(s)`,
    },
    {
      show: Room.roomService,
      icon: <UtensilsCrossed className="h-4 w-4" />,
      label: "Room Service",
    },
    {
      show: Room.TV,
      icon: <Tv className="h-4 w-4" />,
      label: "TV",
    },
    {
      show: Room.freeWifi,
      icon: <Wifi className="h-4 w-4" />,
      label: "Free Wi-Fi",
    },
    {
      show: Room.airCondition,
      icon: <AirVent className="h-4 w-4" />,
      label: "Air Conditioning",
    },
    {
      show: Room.balcony,
      icon: <Home className="h-4 w-4" />,
      label: "Balcony",
    },
    {
      show: Room.cityView,
      icon: <Castle className="h-4 w-4" />,
      label: "City View",
    },
    {
      show: Room.forestView,
      icon: <Trees className="h-4 w-4" />,
      label: "Forest View",
    },
    {
      show: Room.oceanView,
      icon: <Ship className="h-4 w-4" />,
      label: "Ocean View",
    },
    {
      show: Room.soundProofed,
      icon: <Volume className="h-4 w-4" />,
      label: "Sound Proofed",
    },
  ];

  const handleBookRoom = () => {
    if (!userId) return toast.error("Oops! Make sure you are logged in.");
    if (!Hotel?.userId)
      return toast.error(
        "Something went wrong, refresh the page and try again"
      );

    setBookingIsLoading(true);

    const bookingRoomData = {
      room: Room,
      totalPrice: booking.totalPrice,
      breakFastIncluded: booking.breakFastIncluded,
      checkInDate: booking.startDate,
      checkOutDate: booking.endDate,
    };
    setRoomData(bookingRoomData);

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking: {
          hotelOwnerId: Hotel.userId,
          hotelId: Hotel.id,
          roomId: Room.id,
          startDate: bookingRoomData.checkInDate,
          endDate: bookingRoomData.checkOutDate,
          breakFastIncluded: bookingRoomData.breakFastIncluded,
          totalPrice: bookingRoomData.totalPrice,
          currency: "usd",
        },
        payment_intent_id: paymentIntentId,
      }),
    })
      .then((res) => {
        setBookingIsLoading(false);
        if (res.status === 401) return router.push("/login");
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.paymentIntent.client_secret);
        setPaymentIntentId(data.paymentIntent.id);
        router.push("/book-room");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(
          `Error: ${
            error.message ||
            error.response?.data?.message ||
            "Something went wrong!"
          }`
        );
      });
  };

  return (
    <Card>
      <CardHeader className="group relative">
        <CardTitle>{Hotel.title}</CardTitle>
        <CardDescription>
          <div className="font-semibold mt-4">
            <AmenityItem>
              <MapPin className="h-4 w-4" />
              {country?.name}, {state?.name}, {Hotel.city}
            </AmenityItem>
          </div>

          <p className="my-2 line-clamp-1 overflow-hidden text-ellipsis transition-all duration-300 ease-in-out group-hover:line-clamp-none group-hover:overflow-visible group-hover:whitespace-normal">
            {Hotel.locationDescription}
          </p>
        </CardDescription>

        <CardTitle>{Room.title}</CardTitle>
        <CardDescription className="line-clamp-1 overflow-hidden text-ellipsis transition-all duration-300 ease-in-out group-hover:line-clamp-none group-hover:overflow-visible group-hover:whitespace-normal">
          {Room.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square h-[200px] rounded-lg overflow-hidden relative">
          <Image
            fill
            src={Room.image}
            alt={Room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 start-content text-sm">
          {amenities
            .filter((item) => item.show)
            .map((item, index) => (
              <AmenityItem key={index}>
                {item.icon}
                {item.label}
              </AmenityItem>
            ))}
        </div>
        <hr />
        <div className="flex gap-4 justify-between">
          <div>
            Room Price: <span className="font-bold">${Room.roomPrice}</span>
            <span className="text-xs"> /night</span>
          </div>
          {!!Room.breakFastPrice && (
            <div>
              BreakFast:{" "}
              <span className="font-bold">${Room.breakFastPrice}</span>
            </div>
          )}
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <CardTitle>Booking Details</CardTitle>
          <div className="text-primary/90">
            <div>
              Room booked by {booking.userName} for {dayCount} days -{" "}
              {moment(booking.bookedAt).fromNow()}
            </div>
            <div>Check-in: {startDate} at 5PM</div>
            <div>Check-out: {endDate} at 5PM</div>

            {booking.breakFastIncluded && <div>Breakfast will be served</div>}

            {booking.paymentStatus ? (
              <div className="text-teal-500">
                ✅ Paid ${booking.totalPrice} - Room Reserved
              </div>
            ) : (
              <div className="text-rose-500">
                ❌ Not Paid ${booking.totalPrice} - Room Not Reserved
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          disabled={bookingIsLoading}
          variant="outline"
          onClick={() => router.push(`/hotel-details/${Hotel.id}`)}
        >
          View Hotel
        </Button>

        {!booking.paymentStatus && booking.userId === userId && (
          <Button disabled={bookingIsLoading} onClick={() => handleBookRoom()}>
            {bookingIsLoading ? "Processing..." : "Pay Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MyBookingClient;
