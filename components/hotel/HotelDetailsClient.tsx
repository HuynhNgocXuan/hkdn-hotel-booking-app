"use client";

import Image from "next/image";
import { HotelWithRooms } from "./AddHotelForm";
import { Booking } from "@prisma/client";
import AmenityItem from "../AmenityItem";
import {
  Clapperboard,
  Coffee,
  Dumbbell,
  MapPin,
  ParkingSquare,
  ShoppingBasket,
  Utensils,
  WashingMachine,
  Wine,
} from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonSwimming, faSpa } from "@fortawesome/free-solid-svg-icons";
import RoomCard from "../room/RoomCard";

const HotelDetailsClient = ({
  hotel,
  bookings,
}: {
  hotel: HotelWithRooms;
  bookings: Booking[];
}) => {
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(hotel.country);
  const state = getStateByCode(hotel.country, hotel.state);

  const amenities = [
    {
      visible: hotel.swimmingPool,
      label: "Pool",
      icon: <FontAwesomeIcon icon={faPersonSwimming} />,
    },
    {
      visible: hotel.gym,
      label: "Gym",
      icon: <Dumbbell className="w-4 h-4" />,
    },
    {
      visible: hotel.spa,
      label: "Spa",
      icon: <FontAwesomeIcon icon={faSpa} />,
    },
    { visible: hotel.bar, label: "Bar", icon: <Wine className="w-4 h-4" /> },
    {
      visible: hotel.laundry,
      label: "Laundry",
      icon: <WashingMachine className="w-4 h-4" />,
    },
    {
      visible: hotel.restaurant,
      label: "Restaurant",
      icon: <Utensils className="w-4 h-4" />,
    },
    {
      visible: hotel.shopping,
      label: "Shopping",
      icon: <ShoppingBasket className="w-4 h-4" />,
    },
    {
      visible: hotel.freeParking,
      label: "Free Parking",
      icon: <ParkingSquare className="w-4 h-4" />,
    },
    {
      visible: hotel.movieNights,
      label: "Movie Nights",
      icon: <Clapperboard className="w-4 h-4" />,
    },
    {
      visible: hotel.coffeeShop,
      label: "Coffee Shop",
      icon: <Coffee className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-2 ">
      <div
        className="aspect-square h-[200px] overflow-hidden relative w-full md:h-[400px] rounded-lg
        "
      >
        <Image
          src={hotel.image}
          alt={hotel.title}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="font-semibold text-xl md:text-3xl">{hotel.title}</h3>
        <div className="font-semibold mt-4">
          <AmenityItem>
            <MapPin className="h-4 w-4" />
            {country?.name}, {state?.name}, {hotel.city}
          </AmenityItem>
        </div>

        <h3 className="font-semibold text-lg mt-4 mb-2">Location Details</h3>
        <p className="text-primary/90 mb-2">{hotel.locationDescription}</p>

        <h3 className="font-semibold text-lg mt-4 mb-2">About this hotel</h3>
        <p className="text-primary/90 mb-2">{hotel.description}</p>

        <h3 className="font-semibold text-lg mt-4 mb-2">Popular Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
          {amenities.map(
            (item, index) =>
              item.visible && (
                <AmenityItem key={index}>
                  {item.icon} {item.label}
                </AmenityItem>
              )
          )}
        </div>
      </div>
      {!!hotel.rooms.length && (
        <div>
          <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotel.rooms.map((room) => (
              <RoomCard
                key={room.id}
                hotel={hotel}
                room={room} 
                bookings={bookings}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailsClient;
