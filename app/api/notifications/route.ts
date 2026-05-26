import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/notifications
// Retrieves notifications for the logged-in user
export async function GET() {
  try {
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

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications
// Marks notifications as read (either all or a specific one)
export async function PATCH(request: Request) {
  try {
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

    const body = await request.json();
    const { notificationId } = body;

    if (notificationId) {
      // Mark a single notification as read
      await prisma.notification.update({
        where: { id: notificationId, userId },
        data: { read: true },
      });
    } else {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
