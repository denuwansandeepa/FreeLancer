import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("skilllanka_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    const freelancerId = payload.id;

    const user = await prisma.user.findUnique({ where: { id: freelancerId } });
    if (!user || user.role !== "FREELANCER") {
      return NextResponse.json({ success: false, message: "Only freelancers can apply to jobs." }, { status: 403 });
    }

    const body = await request.json();
    const { jobRequestId, message, budget } = body;

    if (!jobRequestId || !message) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    const jobRequest = await prisma.jobRequest.findUnique({
      where: { id: jobRequestId },
    });

    if (!jobRequest) {
      return NextResponse.json({ success: false, message: "Job request not found." }, { status: 404 });
    }
    
    // Check if already applied
    const existingApplication = await prisma.hireRequest.findFirst({
      where: {
        freelancerId,
        jobRequestId
      }
    });
    
    if (existingApplication) {
      return NextResponse.json({ success: false, message: "You have already applied for this job." }, { status: 400 });
    }

    // Create the hire request pointing to the job
    const hireRequest = await prisma.hireRequest.create({
      data: {
        clientId: jobRequest.clientId,
        freelancerId,
        jobRequestId,
        message,
        budget: budget || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application sent successfully!",
      hireRequest,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to send application", error: String(error) },
      { status: 500 }
    );
  }
}
