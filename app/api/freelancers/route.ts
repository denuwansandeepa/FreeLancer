import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const profiles = await prisma.freelancerProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            receivedReviews: {
              select: {
                rating: true,
              },
            },
            receivedHireRequests: {
              where: {
                status: "COMPLETED",
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const formattedFreelancers = profiles.map((profile) => {
      const reviews = profile.user.receivedReviews;
      const avgRating =
        reviews.length > 0
          ? (
              reviews.reduce((acc, curr) => acc + curr.rating, 0) /
              reviews.length
            ).toFixed(1)
          : "5.0";

      const completedJobsCount = profile.user.receivedHireRequests.length;

      return {
        id: profile.id,
        name: profile.user.name,
        image: profile.user.image || profile.profileImage,
        title: profile.title,
        location: profile.location || profile.user.location || "Sri Lanka",
        category: profile.category,
        skills: profile.skills ? profile.skills.split(",").map((s) => s.trim()) : [],
        price: profile.startingPrice || "Negotiable",
        rating: avgRating,
        completedJobs: completedJobsCount,
        experience: profile.experience || "Not specified",
        responseTime: profile.responseTime || "N/A",
        description: profile.bio,
      };
    });

    return NextResponse.json({
      success: true,
      freelancers: formattedFreelancers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch freelancers from database.",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
