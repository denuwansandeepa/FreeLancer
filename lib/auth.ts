import { JWTPayload, SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "temporary_skilllanka_secret_key",
);

// Define what user information we want to store inside the token.
export type TokenPayload = JWTPayload & {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Create a new token using the user's information.
export async function createToken(payload: TokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // Use the HS256 security algorithm
    .setIssuedAt() // Set the creation time
    .setExpirationTime("3h") // Make the token expire after 3 hours
    .sign(secret); // Sign the token with our secret key
}

// Check if the token is valid and read the user information from it.
export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret); // Verify using the secret key
  return payload as TokenPayload; // Return the data stored inside the token
}
