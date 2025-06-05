import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.hotelId)
      return new NextResponse("Hotel ID is required", { status: 400 });

    const updatedHotel = await prismadb.hotel.update({
      where: {
        id: params.hotelId,
      },
      data: {
        ...body,
      },
    });
 
    return NextResponse.json(updatedHotel, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH api/hotel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { hotelId: string } }) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.hotelId)
      return new NextResponse("Hotel ID is required", { status: 400 });

    const deletedHotel = await prismadb.hotel.delete({
      where: {
        id: params.hotelId,
      },
    });

    return NextResponse.json(deletedHotel, { status: 201 });
  } catch (error) {
    console.error("Error in DELETE api/hotel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
