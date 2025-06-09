import { Room } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookRoomStore {
  bookingRoomData: RoomDataType | null;
  paymentIntentId: string | null;
  clientSecret: string | undefined;
  setRoomData: (data: RoomDataType) => void;
  setPaymentIntentId: (paymentIntentId: string) => void;
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
      paymentIntentId: null,
      clientSecret: undefined,

      setRoomData: (data: RoomDataType) => {
        set({ bookingRoomData: data });
      },

      setPaymentIntentId: (paymentIntentId: string) => {
        set({ paymentIntentId });
      },

      setClientSecret: (clientSecret: string | undefined) => {
        set({ clientSecret });
      },

      resetBookingData: () => {
        set({
          bookingRoomData: null,
          paymentIntentId: null,
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