import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


// ✅ PATCH: Cập nhật trạng thái thanh toán
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ Id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { Id } = await params;
    if (!Id)
      return new NextResponse("Payment Intent ID is required", { status: 400 });

    const updatedBooking = await prismadb.booking.update({
      where: { paymentIntentId: Id },
      data: { paymentStatus: true },
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("[BOOKING_PATCH_ERROR]", error);

    return NextResponse.json({ message: error }, { status: 500 });

  
  }
}

// ✅ DELETE: Xóa booking theo ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ Id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { Id } = await params;
    if (!Id) return new NextResponse("Booking ID is required", { status: 400 });

    const deletedBooking = await prismadb.booking.delete({
      where: { id: Id },
    });

    return NextResponse.json(deletedBooking, { status: 200 });
  } catch (error) {
    console.error("[BOOKING_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ✅ GET: Lấy danh sách booking của 1 phòng (roomId)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ Id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { Id } = await params;
    if (!Id) return new NextResponse("Room ID is required", { status: 400 });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await prismadb.booking.findMany({
      where: {
        paymentStatus: true,
        roomId: Id,
        endDate: { gt: yesterday },
      },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("[BOOKING_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
