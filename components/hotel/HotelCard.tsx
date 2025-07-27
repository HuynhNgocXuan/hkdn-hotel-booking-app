"use client";

import { usePathname, useRouter } from "next/navigation";
import { HotelWithRooms } from "./AddHotelForm";
import { cn } from "@/lib/utils";
import AmenityItem from "../AmenityItem";
import { Dumbbell, MapPin } from "lucide-react";
import Image from "next/image";
import useLocation from "@/hooks/useLocation";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonSwimming } from "@fortawesome/free-solid-svg-icons";

const HotelCard = ({ hotel }: { hotel: HotelWithRooms }) => {
  const pathname = usePathname();
  const isMyHotels = pathname.includes("my-hotels");
  const router = useRouter();

  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(hotel.country);

  return (
    <div
      onClick={() => !isMyHotels && router.push(`/hotel-details/${hotel.id}`)}
      className={cn(
        "col-span-1 cursor-pointer transition hover:scale-104",
        isMyHotels && "cursor-default"
      )}
    >
      <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
        <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
          <Image
            fill
            src={hotel.image}
            alt={hotel.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
          <h3 className="font-semibold text-xl line-clamp-2 overflow-hidden text-ellipsis transition-all duration-300 ease-in-out group-hover:line-clamp-none group-hover:overflow-visible group-hover:whitespace-normal">
            {hotel.title}
          </h3>
          <div className="text-primary/90 line-clamp-2 overflow-hidden text-ellipsis transition-all duration-300 ease-in-out group-hover:line-clamp-none group-hover:overflow-visible group-hover:whitespace-normal">
            {hotel.description}
          </div>
          <div className="text-primary/90">
            <AmenityItem>
              <MapPin className="w-4 h-4 line-clamp-2 overflow-hidden text-ellipsis transition-all duration-300 ease-in-out group-hover:line-clamp-none group-hover:overflow-visible group-hover:whitespace-normal" />
              {country?.name}, {hotel.city}
            </AmenityItem>
            {hotel.swimmingPool && (
              <AmenityItem>
                <FontAwesomeIcon icon={faPersonSwimming} />
                Pool
              </AmenityItem>
            )}
            {hotel.gym && (
              <AmenityItem>
                <Dumbbell className="w-4 h-4" />
                Gym
              </AmenityItem>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {hotel.rooms[0]?.roomPrice && (
                <>
                  <div className="font-semibold text-base">
                    {hotel.rooms[0].roomPrice}
                  </div>
                  <div className="text-xs">/night</div>
                </>
              )}
            </div>
            {isMyHotels && (
              <Button
                onClick={() => router.push(`/hotel/${hotel.id}`)}
                variant="outline"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
