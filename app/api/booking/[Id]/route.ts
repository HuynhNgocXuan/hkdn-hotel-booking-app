import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest } from "next";

export async function PATCH(req: NextRequest, { params }: { params: { Id: string } }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { Id } = params;

    if (!Id) {
      return new NextResponse("Payment Intent ID is required", { status: 400 });
    }

    const updateBooking = await prismadb.booking.update({
      where: { paymentIntentId: Id },
      data: { paymentStatus: true },
    });

    return NextResponse.json(updateBooking, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH api/booking/Id:", error);
    return NextResponse.json({ message: (error as any).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { Id: string } }) {

  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { Id } = await context.params as { Id: string };

    if (!Id) {
      return new NextResponse("Booking ID is required", { status: 400 });
    }

    const deletedBooking = await prismadb.booking.delete({
      where: { id: Id },
    });

    return NextResponse.json(deletedBooking, { status: 201 });
  } catch (error) {
    console.error("Error in DELETE api/booking/Id:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function GET(req: NextRequest, { params }: { params: { Id: string } }) {

  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { Id } = await context.params as { Id: string };

    if (!Id) {
      return new NextResponse("Hotel ID is required", { status: 400 });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await prismadb.booking.findMany({
      where: {
        paymentStatus: true,
        roomId: Id,
        endDate: { gt: yesterday },
      },
    });

    return NextResponse.json(bookings, { status: 201 });
  } catch (error) {
    console.error("Error in GET api/booking/Id:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
