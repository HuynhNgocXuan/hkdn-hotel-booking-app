import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

// PATCH: Cập nhật thông tin khách sạn
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { hotelId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!hotelId) {
      return new NextResponse("Hotel ID is required", { status: 400 });
    }

    const body = await req.json();

    const updatedHotel = await prismadb.hotel.update({
      where: {
        id: hotelId,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedHotel, { status: 200 });
  } catch (error) {
    console.error("[HOTEL_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE: Xoá khách sạn
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { hotelId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!hotelId) {
      return new NextResponse("Hotel ID is required", { status: 400 });
    }

    const deletedHotel = await prismadb.hotel.delete({
      where: {
        id: hotelId,
      },
    });

    return NextResponse.json(deletedHotel, { status: 200 });
  } catch (error) {
    console.error("[HOTEL_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
