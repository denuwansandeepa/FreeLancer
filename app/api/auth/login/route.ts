import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { createToken } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    // Read the email and password from the request body
    const body = await request.json();
    const { email, password } = body;

    // Check if the user forgot to enter email or password
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    // Look for the user in the database by their email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If no user is found with this email, reject the login
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords do not match, reject the login
    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Create a new JWT token containing the user's details
    const token = await createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Prepare a successful login response with user info
    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
      },
    });

    // Save the token inside a secure cookie in the user's browser
    response.cookies.set("skilllanka_token", token, {
      httpOnly: true, // Prevents Javascript from reading this cookie (adds security)
      secure: process.env.NODE_ENV === "production", // Use HTTPS secure cookie in production
      sameSite: "lax",
      path: "/", // Available across the whole website
      maxAge: 60 * 60 * 3, // Cookie expires in 3 hours (in seconds)
    });

    return response;
  } catch (error) {
    // If anything goes wrong, return a 500 error code
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging in.",
        error: String(error),
      },
      { status: 500 }
    );
  }
}