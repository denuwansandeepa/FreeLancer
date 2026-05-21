import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(
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
        client: { select: { id: true, name: true, image: true } },
        freelancer: { select: { id: true, name: true, image: true } },
        service: { select: { title: true } },
        chatMessages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            message: true,
            senderId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!hireRequest) {
      return NextResponse.json(
        { success: false, message: "Hire request not found" },
        { status: 404 }
      );
    }

    // Ensure the user is either the client or the freelancer of this request
    if (hireRequest.clientId !== userId && hireRequest.freelancerId !== userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      hireRequest,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    // Only the freelancer can accept or reject
    if (hireRequest.freelancerId !== userId) {
      return NextResponse.json(
        { success: false, message: "Only the freelancer can update status" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!["ACCEPTED", "REJECTED", "COMPLETED"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.hireRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: `Request marked as ${status}`,
      hireRequest: updatedRequest,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
