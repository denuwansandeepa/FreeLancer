import { NextResponse } from "next/server";
import { authorizeAdmin } from "../authCheck";
import { prisma } from "../../../../lib/prisma";

// This endpoint counts the total numbers of users, jobs, services, and hires.
export async function GET() {
  try {
    // Check if the user making this request is an admin
    await authorizeAdmin();

    // Count how many users are registered in the system
    const totalUsers = await prisma.user.count();
    // Count how many users have the role CLIENT
    const totalClients = await prisma.user.count({ where: { role: "CLIENT" } });
    // Count how many users have the role FREELANCER
    const totalFreelancers = await prisma.user.count({ where: { role: "FREELANCER" } });
    // Count total job postings created by clients
    const totalJobs = await prisma.jobRequest.count();
    // Count total service gigs posted by freelancers
    const totalServices = await prisma.service.count();
    // Count total hire orders created in the system
    const totalHires = await prisma.hireRequest.count();

    // Count jobs that are currently open/active
    const openJobs = await prisma.jobRequest.count({ where: { status: "OPEN" } });
    // Count hires that are marked as COMPLETED
    const completedHires = await prisma.hireRequest.count({ where: { status: "COMPLETED" } });

    // Send the stats data back to the admin frontend
    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalClients,
        totalFreelancers,
        totalJobs,
        totalServices,
        totalHires,
        openJobs,
        completedHires,
      },
    });
  } catch (error: any) {
    // If there is an error, return a failure response
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: error.message?.includes("Forbidden") ? 403 : 401 }
    );
  }
}
