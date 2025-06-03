import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = await prismadb.room.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Error in POST api/room:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
