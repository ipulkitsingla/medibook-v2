import { cookies } from "next/headers";

// POST /api/admin-auth/logout — simply deletes the cookie
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return Response.json({ message: "Logged out successfully" });
}
