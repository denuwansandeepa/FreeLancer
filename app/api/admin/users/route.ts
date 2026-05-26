import { NextResponse } from "next/server";
import { authorizeAdmin } from "../authCheck";
import { prisma } from "../../../../lib/prisma";

// This endpoint gets all users registered on the website
export async function GET() {
  try {
    // Only allow admin users to fetch the user list
    await authorizeAdmin();
    
    // Get users from database, only selecting fields we want to show
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        location: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// This endpoint deletes a user from the database
export async function DELETE(request: Request) {
  try {
    // Only allow admin users to delete a user
    await authorizeAdmin();
    
    // Read the user ID from the URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    // If ID is missing, return an error
    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    // Delete the user from the database
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// This endpoint updates a user's role (e.g., CLIENT to FREELANCER)
export async function PATCH(request: Request) {
  try {
    // Only allow admin users to update roles
    await authorizeAdmin();
    
    // Read the user ID and new role from the request body
    const { userId, role } = await request.json();

    // If inputs are missing, return an error
    if (!userId || !role) {
      return NextResponse.json({ success: false, message: "User ID and Role are required" }, { status: 400 });
    }

    // Update the user's role in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
