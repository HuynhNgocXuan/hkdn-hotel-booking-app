import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export const getHotelsByUserId = async () => {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");
    const hotels = await prismadb.hotel.findMany({
      where: {
        userId,
      },
      include: {
        rooms: true,
      },
    });

    if (!hotels) return null;

    return hotels;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(String(error));
  }
};
