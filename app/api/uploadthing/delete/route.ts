import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { imageKey } = await req.json();
  try {
    const res = await utapi.deleteFiles(imageKey);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error deleting file:", error);
    return new Response("Error deleting file", { status: 500 });
  }
}
