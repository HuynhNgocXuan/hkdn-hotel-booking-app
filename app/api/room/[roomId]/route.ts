import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { RouteContext } from "next"; // Optional

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const roomId = (context.params as { roomId: string }).roomId;

    if (!roomId)
      return new NextResponse("Room ID is required", { status: 400 });

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
    console.error("Error in PATCH api/room:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const roomId = (context.params as { roomId: string }).roomId;

    if (!roomId)
      return new NextResponse("Room ID is required", { status: 400 });

    const deletedRoom = await prismadb.room.delete({
      where: {
        id: roomId,
      },
    });

    return NextResponse.json(deletedRoom, { status: 201 });
  } catch (error) {
    console.error("Error in DELETE api/room:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
