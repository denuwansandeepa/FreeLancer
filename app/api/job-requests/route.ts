import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

export async function GET() {
  try {
    const jobRequests = await prisma.jobRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      jobRequests,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load job requests.",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("skilllanka_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login before posting a job.",
        },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    const body = await request.json();

    const {
      title,
      description,
      category,
      budget,
      deadline,
      location,
      skills,
    } = body;

    if (!title || !description || !category || !budget) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, category, and budget are required.",
        },
        { status: 400 }
      );
    }

    const jobRequest = await prisma.jobRequest.create({
      data: {
        clientId: user.id,
        title,
        description,
        category,
        budget,
        deadline: deadline || null,
        location: location || null,
        skills: skills || null,
        status: "OPEN",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Job request posted successfully.",
        jobRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while posting job request.",
        error: String(error),
      },
      { status: 500 }
    );
  }
}