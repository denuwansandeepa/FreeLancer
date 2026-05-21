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
        { success: false, message: "Unauthorized: Missing authentication token" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    const userId = payload.id;

    const {
      name,
      phone,
      location,
      image,
      title,
      bio,
      category,
      skills,
      startingPrice,
      experience,
      responseTime,
    } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        location,
        image,
      },
    });

    let updatedProfile = null;

    if (updatedUser.role === "FREELANCER") {
      updatedProfile = await prisma.freelancerProfile.upsert({
        where: { userId: updatedUser.id },
        update: {
          location: updatedUser.location || "Sri Lanka",
          profileImage: updatedUser.image,
          ...(title !== undefined && { title }),
          ...(bio !== undefined && { bio }),
          ...(category !== undefined && { category }),
          ...(skills !== undefined && { skills }),
          ...(experience !== undefined && { experience }),
          ...(startingPrice !== undefined && { startingPrice }),
          ...(responseTime !== undefined && { responseTime }),
        },
        create: {
          userId: updatedUser.id,
          title: title || "New Freelancer",
          bio: bio || `Hi, I am ${updatedUser.name}. I am ready to work.`,
          category: category || "Other",
          location: updatedUser.location || "Sri Lanka",
          skills: skills || "Not specified",
          startingPrice: startingPrice || "Negotiable",
          experience: experience || "New",
          profileImage: updatedUser.image,
          responseTime: responseTime || "N/A",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        location: updatedUser.location,
        image: updatedUser.image,
        freelancerProfile: updatedProfile,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile.",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        freelancerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        image: user.image,
        freelancerProfile: user.freelancerProfile,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile.",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
