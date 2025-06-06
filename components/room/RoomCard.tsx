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
  Loader2,
  PencilLine,
  Ship,
  Trash,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  Volume,
  Wifi,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";
import { toast } from "sonner";
import axios from "axios";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}
const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [Open, setOpen] = useState(false);

  const pathname = usePathname();
  const isHotelDetailsPage = pathname.includes("hotel-details");
  const router = useRouter();

  const amenities = [
    {
      show: true,
      icon: <Bed className="h-4 w-4" />,
      label: `${room.bedCount} Bed(s)`,
    },
    {
      show: true,
      icon: <Users className="h-4 w-4" />,
      label: `${room.guestCount} Guest(s)`,
    },
    {
      show: true,
      icon: <Bath className="h-4 w-4" />,
      label: `${room.bathroomCount} Bathroom(s)`,
    },
    {
      show: !!room.kingBed,
      icon: <BedDouble className="h-4 w-4" />,
      label: `${room.kingBed} King Bed(s)`,
    },
    {
      show: !!room.queenBed,
      icon: <Bed className="h-4 w-4" />,
      label: `${room.queenBed} Queen Bed(s)`,
    },
    {
      show: room.roomService,
      icon: <UtensilsCrossed className="h-4 w-4" />,
      label: "Room Service",
    },
    {
      show: room.TV,
      icon: <Tv className="h-4 w-4" />,
      label: "TV",
    },
    {
      show: room.freeWifi,
      icon: <Wifi className="h-4 w-4" />,
      label: "Free Wi-Fi",
    },
    {
      show: room.airCondition,
      icon: <AirVent className="h-4 w-4" />,
      label: "Air Conditioning",
    },
    {
      show: room.balcony,
      icon: <Home className="h-4 w-4" />,
      label: "Balcony",
    },
    {
      show: room.cityView,
      icon: <Castle className="h-4 w-4" />,
      label: "City View",
    },
    {
      show: room.forestView,
      icon: <Trees className="h-4 w-4" />,
      label: "Forest View",
    },
    {
      show: room.oceanView,
      icon: <Ship className="h-4 w-4" />,
      label: "Ocean View",
    },
    {
      show: room.soundProofed,
      icon: <Volume className="h-4 w-4" />,
      label: "Sound Proofed",
    },
  ];

  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleRoomDelete = async (room: Room) => {
    setIsLoading(true);
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf("/") + 1);
    try {
      const imageKey = getImageKey(room.image);
      if (!hotel?.id) {
        toast.error("Hotel ID is required for deletion");
        setIsLoading(false);
        return;
      }
      await axios.post("/api/uploadthing/delete", { imageKey });
      await axios.delete(`/api/room/${room.id}`);
      toast.success("Room deleted successfully");
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting room:", error);
      toast.error("Error deleting room");
    }
  };

  return (
    <Card>
      <CardHeader className="group relative">
        <CardTitle>{room.title}</CardTitle>
        <CardDescription className="line-clamp-1 overflow-hidden text-ellipsis transition-all duration-300 ease-in-out group-hover:line-clamp-none group-hover:overflow-visible group-hover:whitespace-normal">
          {room.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square h-[200px] rounded-lg overflow-hidden relative">
          <Image
            fill
            src={room.image}
            alt={room.title}
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
            Room Price: <span className="font-bold">${room.roomPrice}</span>
            <span className="text-xs"> /24hrs</span>
          </div>
          {!!room.breakFastPrice && (
            <div>
              BreakFast:{" "}
              <span className="font-bold">${room.breakFastPrice}</span>
            </div>
          )}
        </div>
        <hr />
      </CardContent>
      <CardFooter>
        {isHotelDetailsPage ? (
          <div>Hotel Details Page </div>
        ) : (
          <div className="flex justify-between w-full">
            <Button
              onClick={() => handleRoomDelete(room)}
              disabled={isLoading}
              variant="ghost"
              type="button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4" />
                  Deleting..
                </>
              ) : (
                <>
                  <Trash className="w-4 h-4" />
                  Delete
                </>
              )}
            </Button>
            <Dialog open={Open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button variant={"outline"} type="button">
                  <PencilLine className="w-4 h-4" />
                  Update Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[900px] w-[90%]">
                <DialogHeader>
                  <DialogTitle>Update a room</DialogTitle>
                  <DialogDescription>
                    Make changes to this room.
                  </DialogDescription>
                  <AddRoomForm
                    hotel={hotel}
                    room={room}
                    handleDialogueOpen={handleDialogueOpen}
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
