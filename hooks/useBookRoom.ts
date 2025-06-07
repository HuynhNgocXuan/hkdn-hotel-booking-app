import { Room } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookRoomStore {
  bookingRoomData: RoomDataType | null;
  paymentIntent: string | null;
  clientSecret: string | undefined;
  setRoomData: (data: RoomDataType) => void;
  setPaymentIntent: (paymentIntent: string) => void;
  setClientSecret: (clientSecret: string) => void;
  resetBookingData: () => void;
}

type RoomDataType = {
  room: Room;
  totalPrice: number;
  breakFastIncluded: boolean;
  checkInDate: Date;
  checkOutDate: Date;
};

const useBookRoom = create<BookRoomStore>()(
  persist(
    (set) => ({
      bookingRoomData: null,
      paymentIntent: null,
      clientSecret: undefined,

      setRoomData: (data: RoomDataType) => {
        set({ bookingRoomData: data });
      },

      setPaymentIntent: (paymentIntent: string) => {
        set({ paymentIntent });
      },

      setClientSecret: (clientSecret: string | undefined) => {
        set({ clientSecret });
      },

      resetBookingData: () => {
        set({
          bookingRoomData: null,
          paymentIntent: null,
          clientSecret: undefined,
        });
      },
    }),
    {
      name: "BookRoom",
    }
  )
);

export default useBookRoom;