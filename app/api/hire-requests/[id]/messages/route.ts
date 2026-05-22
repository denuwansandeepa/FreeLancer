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
      include: {
        client: { select: { id: true, name: true } },
        freelancer: { select: { id: true, name: true } },
      },
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
        senderId: userId,
        hireRequestId: id,
        message: message.trim(),
      },
    });

    // Create a database notification for the message recipient
    const recipientId = userId === hireRequest.clientId ? hireRequest.freelancerId : hireRequest.clientId;
    const senderName = userId === hireRequest.clientId ? hireRequest.client.name : hireRequest.freelancer.name;
    const previewText = message.length > 40 ? `${message.substring(0, 40).trim()}...` : message.trim();

    await prisma.notification.create({
      data: {
        userId: recipientId,
        text: `New message from ${senderName}: "${previewText}"`,
        link: `/dashboard?requestId=${id}`,
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
