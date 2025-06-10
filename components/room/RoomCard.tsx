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
  Wand2,
  Wifi,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
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
import { DatePickerWithRange } from "./DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}
const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const { setClientSecret, setPaymentIntentId, setRoomData, paymentIntentId } =
    useBookRoom();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const [Open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.roomPrice);
  const [includeBreakFast, setIncludeBreakFast] = useState(false);
  const [days, setDays] = useState(1);

  const pathname = usePathname();
  const isHotelDetailsPage = pathname.includes("hotel-details");
  const router = useRouter();
  const { userId } = useAuth();

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

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      setDays(dayCount);
      if (dayCount && room.roomPrice) {
        if (includeBreakFast && room.breakFastPrice) {
          setTotalPrice(
            room.roomPrice * dayCount + room.breakFastPrice * dayCount
          );
        } else {
          setTotalPrice(room.roomPrice * dayCount);
        }
      }
    }
  }, [date, room.roomPrice, includeBreakFast]);

  const disableDates = useMemo(() => {
    let dates: Date[] = [];

    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.id
    );

    roomBookings.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [bookings]);

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

  const handleBookRoom = () => {
    if (!userId) return toast.error("Oops! Make sure you are logged in.");
    if (!hotel?.userId)
      return toast.error(
        "Something went wrong, refresh the page and try again"
      );

    if (date?.from && date?.to) {
      setBookingIsLoading(true);

      const bookingRoomData = {
        room,
        totalPrice,
        breakFastIncluded: includeBreakFast,
        checkInDate: date.from,
        checkOutDate: date.to,
      };
      setRoomData(bookingRoomData);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakFastIncluded: includeBreakFast,
            totalPrice: totalPrice,
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
          console.log("Error", error);
          toast.error("Error!", error);
        });
    } else {
      toast.warning("Oops! Select Date");
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
            <span className="text-xs"> /night</span>
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
          <div className="flex flex-col gap-4 w-full">
            <div>
              <div className="mb-2">
                Select days that you will spend in this room
              </div>
              <DatePickerWithRange
                date={date}
                setDate={setDate}
                disableDates={disableDates}
              />
            </div>
            {room.breakFastPrice > 0 && (
              <div>
                <div>Do you want to serve breakfast each day</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id={room.id}
                    onCheckedChange={(value) => setIncludeBreakFast(!!value)}
                  />
                  <label htmlFor={room.id} className="text-sm">
                    Include Breakfast
                  </label>
                </div>
              </div>
            )}
            <div>
              Total Price: <span className="font-bold">{totalPrice}</span> for{" "}
              <span className="font-bold">{days}</span>{" "}
              {days > 1 ? "Nights" : "Night"}
            </div>
            {bookingIsLoading ? (
              <Button
                variant="secondary"
                disabled={bookingIsLoading}
                type="button"
              >
                <Loader2 className="h-4 w-4" />
                Loading...{" "}
              </Button>
            ) : (
              <Button
                disabled={bookingIsLoading}
                type="button"
                onClick={() => handleBookRoom()}
              >
                <Wand2 className="h-4 w-4" />
                Book Room
              </Button>
            )}
          </div>
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
