import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    // Get the cookies from the browser
    const cookieStore = await cookies();
    // Retrieve the JWT token stored under the name "skilllanka_token"
    const token = cookieStore.get("skilllanka_token")?.value;

    // If the token is missing, the user is not logged in
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 }
      );
    }

    // Verify the token and extract the user payload information
    const payload = await verifyToken(token);

    // Find the user details in the database using the ID from the token
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        location: true,
        image: true,
        createdAt: true,
      },
    });

    // If no user exists with this ID, return a 404 error
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // If verification succeeded and user exists, return their details
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    // If the token is expired or invalid, reject the request
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired session.",
        error: String(error),
      },
      { status: 401 }
    );
  }
}