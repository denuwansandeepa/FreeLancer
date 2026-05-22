import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("skilllanka_token")?.value;

    // Reject request if token is missing
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Verify token and get user ID
    const payload = await verifyToken(token);
    const userId = payload.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (user.role === "FREELANCER") {
      // 1. Fetch Freelancer profile & active services
      const profile = await prisma.freelancerProfile.findUnique({
        where: { userId },
        include: { services: true },
      });

      // 2. Fetch Hire Requests received by this freelancer
      const hireRequests = await prisma.hireRequest.findMany({
        where: { freelancerId: userId },
        include: {
          client: {
            select: { name: true, email: true },
          },
          service: {
            select: { title: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        hasProfile: !!profile, // True if they have a profile created in the DB
        stats: [
          {
            title: "Profile Views",
            value: "248",
            change: "+0 this week",
            icon: "👀",
          },
          {
            title: "Hire Requests",
            value: hireRequests.length.toString(),
            change: "New requests",
            icon: "📩",
          },
          {
            title: "Active Services",
            value: (profile?.services.length || 0).toString(),
            change: "Featured",
            icon: "💼",
          },
          {
            title: "Completed Jobs",
            value: "0",
            change: "None yet",
            icon: "✅",
          },
        ],
        hireRequests: hireRequests.map((r) => ({
          id: r.id,
          client: r.client.name,
          service: r.service?.title || "Custom Hire Request",
          budget: r.budget || "Negotiable",
          status: r.status,
        })),
        services:
          profile?.services.map((s) => ({
            title: s.title,
            price: s.price,
            orders: 0, // Mock/Zero for now
            status: s.isActive ? "Active" : "Draft",
          })) || [],
      });
    } else {
      // --- Client View ---
      // 1. Fetch Job Requests posted by this client
      const jobRequests = await prisma.jobRequest.findMany({
        where: { clientId: userId },
        include: { hireRequests: true },
        orderBy: { createdAt: "desc" },
      });

      // 2. Fetch Hire Requests sent by this client
      const sentHireRequests = await prisma.hireRequest.findMany({
        where: { clientId: userId },
        include: {
          freelancer: {
            select: { name: true },
          },
          service: {
            select: { title: true },
          },
          jobRequest: {
            select: { title: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const activeHiresCount = sentHireRequests.filter(
        (r) => r.status === "ACCEPTED" || r.status === "PENDING"
      ).length;

      return NextResponse.json({
        success: true,
        stats: [
          {
            title: "Jobs Posted",
            value: jobRequests.length.toString(),
            change: "Active requests",
            icon: "📋",
          },
          {
            title: "Direct Hires Sent",
            value: sentHireRequests.length.toString(),
            change: "Sent requests",
            icon: "✉️",
          },
          {
            title: "Spent Amount",
            value: "Rs. 0",
            change: "This month",
            icon: "💳",
          },
          {
            title: "Active Hires",
            value: activeHiresCount.toString(),
            change: "Ongoing",
            icon: "🤝",
          },
        ],
        postedJobs: jobRequests.map((j) => ({
          title: j.title,
          budget: j.budget,
          proposals: j.hireRequests.length,
          status: j.status,
        })),
        sentHireRequests: sentHireRequests.map((r: any) => ({
          id: r.id,
          freelancer: r.freelancer.name,
          service: r.jobRequest ? `Application: ${r.jobRequest.title}` : (r.service?.title || "Direct Hire Request"),
          budget: r.budget || "Negotiable",
          status: r.status,
        })),
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
