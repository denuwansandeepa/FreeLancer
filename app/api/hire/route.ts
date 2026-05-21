import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("skilllanka_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in to hire freelancers" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    const clientId = payload.id;

    const user = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "CLIENT") {
      return NextResponse.json(
        { success: false, message: "Only clients can hire freelancers." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { serviceId, freelancerProfileId, message, budget } = body;

    let freelancerId = "";
    let finalServiceId = serviceId || null;

    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          freelancerProfile: true,
        },
      });

      if (!service) {
        return NextResponse.json(
          { success: false, message: "Service not found" },
          { status: 404 }
        );
      }
      freelancerId = service.freelancerProfile.userId;
    } else if (freelancerProfileId) {
      const profile = await prisma.freelancerProfile.findUnique({
        where: { id: freelancerProfileId },
      });

      if (!profile) {
        return NextResponse.json(
          { success: false, message: "Freelancer profile not found" },
          { status: 404 }
        );
      }
      freelancerId = profile.userId;
    } else {
      return NextResponse.json(
        { success: false, message: "Missing serviceId or freelancerProfileId" },
        { status: 400 }
      );
    }

    if (clientId === freelancerId) {
      return NextResponse.json(
        { success: false, message: "You cannot hire yourself" },
        { status: 400 }
      );
    }

    // Create the hire request
    const hireRequest = await prisma.hireRequest.create({
      data: {
        clientId,
        freelancerId,
        serviceId: finalServiceId,
        message: message || "I would like to hire you for your services.",
        budget: budget || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Hire request sent successfully!",
      hireRequest,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create hire request.",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
