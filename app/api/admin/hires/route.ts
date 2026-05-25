import { NextResponse } from "next/server";
import { authorizeAdmin } from "../authCheck";
import { prisma } from "../../../../lib/prisma";

// This endpoint gets all hire request transaction records for auditing
export async function GET() {
  try {
    // Check if the current user is an admin
    await authorizeAdmin();
    
    // Fetch all hire requests with client, freelancer, and service titles
    const hires = await prisma.hireRequest.findMany({
      include: {
        client: { select: { name: true, email: true } },
        freelancer: { select: { name: true, email: true } },
        service: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, hires });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// This endpoint deletes a hire request transaction history from the database
export async function DELETE(request: Request) {
  try {
    // Check if the current user is an admin
    await authorizeAdmin();
    
    // Get the hire request ID from the URL parameters
    const { searchParams } = new URL(request.url);
    const hireId = searchParams.get("id");

    // If ID is missing, return an error
    if (!hireId) {
      return NextResponse.json({ success: false, message: "Hire request ID is required" }, { status: 400 });
    }

    // Delete the hire request record from the database
    await prisma.hireRequest.delete({ where: { id: hireId } });
    return NextResponse.json({ success: true, message: "Hire request deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
