import { NextResponse } from "next/server";
import { authorizeAdmin } from "../authCheck";
import { prisma } from "../../../../lib/prisma";

// This endpoint gets all services/gigs listed by freelancers
export async function GET() {
  try {
    // Check if the current user is an admin
    await authorizeAdmin();
    
    // Fetch services from the database with freelancer name and email details
    const services = await prisma.service.findMany({
      include: {
        freelancerProfile: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// This endpoint removes/deletes a service listing from the website
export async function DELETE(request: Request) {
  try {
    // Check if the current user is an admin
    await authorizeAdmin();
    
    // Get the service ID from the URL parameters
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("id");

    // If ID is missing, return an error
    if (!serviceId) {
      return NextResponse.json({ success: false, message: "Service ID is required" }, { status: 400 });
    }

    // Delete the service gig from the database
    await prisma.service.delete({ where: { id: serviceId } });
    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// This endpoint edits/updates details of an existing service gig
export async function PATCH(request: Request) {
  try {
    // Check if the current user is an admin
    await authorizeAdmin();
    
    // Read the fields from the request body
    const body = await request.json();
    const { id, title, description, category, price, delivery, revision, tags } = body;

    // If ID is missing, return an error
    if (!id) {
      return NextResponse.json({ success: false, message: "Service ID is required" }, { status: 400 });
    }

    // Update the service details in the database
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        category,
        price,
        delivery,
        revision,
        tags,
      },
    });

    return NextResponse.json({ success: true, service: updatedService });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
