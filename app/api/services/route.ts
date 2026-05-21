import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      include: {
        freelancerProfile: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedServices = services.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      delivery: service.delivery,
      revision: service.revision,
      seller: service.freelancerProfile.user.name,
    }));

    return NextResponse.json({
      success: true,
      services: formattedServices,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch services.",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("skilllanka_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing authentication token" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    const userId = payload.id;

    // Check if user exists and is a freelancer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { freelancerProfile: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "FREELANCER" || !user.freelancerProfile) {
      return NextResponse.json(
        { success: false, message: "Only freelancers with active profiles can create services." },
        { status: 403 }
      );
    }

    // Parse and validate service creation request body
    const body = await request.json();
    const { title, description, category, price, delivery, revision, tags } = body;

    if (!title || !description || !category || !price || !delivery) {
      return NextResponse.json(
        { success: false, message: "Missing required service details (title, description, category, price, delivery)." },
        { status: 400 }
      );
    }

    // Create service in database
    const newService = await prisma.service.create({
      data: {
        freelancerProfileId: user.freelancerProfile.id,
        title,
        description,
        category,
        price,
        delivery,
        revision: revision || "No revisions specified",
        tags: tags || "",
        isActive: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Service created successfully!",
      service: newService
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create new service.",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
