import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export const getBookingsByUserId = async () => {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const bookings = await prismadb.booking.findMany({
      where: {
        userId
      },
      include: {
        Room: true,
        Hotel: true,
      },
      orderBy: {
        bookedAt: "desc",
      },
    });

    if (!bookings) return null;

    return bookings;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(String(error));
  }
};
