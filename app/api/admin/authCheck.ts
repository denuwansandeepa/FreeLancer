import { cookies } from "next/headers";
import { verifyToken } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

// This helper checks if the current user is an admin.
// If not, it throws an error to block the action.
export async function authorizeAdmin() {
  // Get all cookies from the browser request
  const cookieStore = await cookies();
  // Find the token cookie named 'skilllanka_token'
  const token = cookieStore.get("skilllanka_token")?.value;

  // If there is no token, the user is not logged in
  if (!token) {
    throw new Error("Unauthorized: No session token provided.");
  }

  // Decode the token to get the user ID
  const payload = await verifyToken(token);

  // Find the user in the database using the ID from the token
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  // If the user does not exist, is not an ADMIN, or their email is not authorized in .env, block access
  const allowedAdminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());

  if (
    !user ||
    user.role !== "ADMIN" ||
    !allowedAdminEmails.includes(user.email.toLowerCase())
  ) {
    throw new Error("Forbidden: Admin privileges required.");
  }

  // Return the verified user details
  return user;
}
