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
        jobRequest: { select: { title: true } },
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
      include: {
        freelancer: { select: { name: true } },
        client: { select: { name: true } },
        jobRequest: { select: { title: true } },
      },
    });

    if (!hireRequest) {
      return NextResponse.json(
        { success: false, message: "Hire request not found" },
        { status: 404 }
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

    // Determine authorization
    const isJobApplication = hireRequest.jobRequestId !== null;
    let isAuthorized = false;

    if (status === "ACCEPTED" || status === "REJECTED") {
      if (isJobApplication) {
        // Job application: Only the Client who posted the job can accept/reject
        isAuthorized = hireRequest.clientId === userId;
      } else {
        // Direct hire: Only the Freelancer who was hired can accept/reject
        isAuthorized = hireRequest.freelancerId === userId;
      }
    } else if (status === "COMPLETED") {
      // Completed: Both the Client and the Freelancer can mark the job completed once accepted
      isAuthorized = (hireRequest.clientId === userId || hireRequest.freelancerId === userId) && hireRequest.status === "ACCEPTED";
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to update status for this request." },
        { status: 403 }
      );
    }

    const updatedRequest = await prisma.hireRequest.update({
      where: { id },
      data: { status },
    });

    // If a job application was accepted, update the parent JobRequest status to ACCEPTED
    if (status === "ACCEPTED" && isJobApplication && hireRequest.jobRequestId) {
      await prisma.jobRequest.update({
        where: { id: hireRequest.jobRequestId },
        data: { status: "ACCEPTED" },
      });
    }

    // Determine notification recipient and text
    let notificationRecipientId = "";
    let text = "";

    if (isJobApplication) {
      // Client updated status -> notify freelancer
      notificationRecipientId = hireRequest.freelancerId;
      const jobTitle = hireRequest.jobRequest?.title || "job request";
      if (status === "ACCEPTED") {
        text = `${hireRequest.client.name} accepted your application for the job: "${jobTitle}".`;
      } else if (status === "REJECTED") {
        text = `${hireRequest.client.name} declined your application for the job: "${jobTitle}".`;
      } else if (status === "COMPLETED") {
        text = `${hireRequest.client.name} marked the job "${jobTitle}" as completed.`;
      }
    } else {
      // Freelancer updated status -> notify client
      notificationRecipientId = hireRequest.clientId;
      if (status === "ACCEPTED") {
        text = `${hireRequest.freelancer.name} accepted your custom service offer.`;
      } else if (status === "REJECTED") {
        text = `${hireRequest.freelancer.name} declined your hire request.`;
      } else if (status === "COMPLETED") {
        text = `${hireRequest.freelancer.name} marked the request as completed.`;
      }
    }

    if (notificationRecipientId && text) {
      await prisma.notification.create({
        data: {
          userId: notificationRecipientId,
          text,
          link: `/dashboard?requestId=${id}`,
        },
      });
    }

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
