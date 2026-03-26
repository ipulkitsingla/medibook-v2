import { cookies } from "next/headers";
import { verifyToken } from "../../../../../server/lib/auth";
import connectDB from "../../../../../server/config/db";
import Hospital from "../../../../../server/models/Hospital";

// Helper: check if the request has a valid admin cookie
async function getAdminPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// POST /api/admin/hospitals — create a new hospital
export async function POST(req) {
  try {
    const payload = await getAdminPayload();
    if (!payload) {
      return Response.json({ error: "Please log in first" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // Basic validation — hospital must have a name
    if (!body.name?.trim()) {
      return Response.json({ error: "Hospital name is required" }, { status: 400 });
    }

    const hospital = await Hospital.create(body);
    return Response.json(hospital, { status: 201 });
  } catch (err) {
    console.error("Create hospital error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
