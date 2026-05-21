import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("skilllanka_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    const userId = payload.id;

    const hireRequest = await prisma.hireRequest.findUnique({
      where: { id },
    });

    if (!hireRequest) {
      return NextResponse.json(
        { success: false, message: "Hire request not found" },
        { status: 404 }
      );
    }

    // Ensure the user is part of this request
    if (hireRequest.clientId !== userId && hireRequest.freelancerId !== userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );
    }

    const chatMessage = await prisma.chatMessage.create({
      data: {
        hireRequestId: id,
        senderId: userId,
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: chatMessage,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
