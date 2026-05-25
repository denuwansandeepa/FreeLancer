import { NextResponse } from "next/server";
import { authorizeAdmin } from "../authCheck";
import { prisma } from "../../../../lib/prisma";

// This endpoint gets all job requests posted by clients
export async function GET() {
  try {
    // Check if the current user is an admin
    await authorizeAdmin();
    
    // Fetch all job requests with client details
    const jobs = await prisma.jobRequest.findMany({
      include: {
        client: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// This endpoint deletes/moderates a job posting from the site
export async function DELETE(request: Request) {
  try {
    // Check if the current user is an admin
    await authorizeAdmin();
    
    // Get the job ID from the URL parameters
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("id");

    // If ID is missing, return an error
    if (!jobId) {
      return NextResponse.json({ success: false, message: "Job ID is required" }, { status: 400 });
    }

    // Delete the job request from the database
    await prisma.jobRequest.delete({ where: { id: jobId } });
    return NextResponse.json({ success: true, message: "Job request deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// This endpoint updates/edits details of a job request
export async function PATCH(request: Request) {
  try {
    // Check if the current user is an admin
    await authorizeAdmin();
    
    // Read parameters from request body
    const body = await request.json();
    const { id, title, description, category, budget, deadline, location, skills, status } = body;

    // If ID is missing, return an error
    if (!id) {
      return NextResponse.json({ success: false, message: "Job ID is required" }, { status: 400 });
    }

    // Update job details in the database
    const updatedJob = await prisma.jobRequest.update({
      where: { id },
      data: {
        title,
        description,
        category,
        budget,
        deadline,
        location,
        skills,
        status,
      },
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
