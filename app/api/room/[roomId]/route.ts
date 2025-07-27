import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

// PATCH: Cập nhật thông tin phòng
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!roomId) {
      return new NextResponse("Room ID is required", { status: 400 });
    }

    const body = await req.json();

    const updatedRoom = await prismadb.room.update({
      where: {
        id: roomId,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (error) {
    console.error("[ROOM_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE: Xoá phòng
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!roomId) {
      return new NextResponse("Room ID is required", { status: 400 });
    }

    const deletedRoom = await prismadb.room.delete({
      where: {
        id: roomId,
      },
    });

    return NextResponse.json(deletedRoom, { status: 200 });
  } catch (error) {
    console.error("[ROOM_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
