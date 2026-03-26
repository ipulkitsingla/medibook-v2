import { cookies } from "next/headers";
import { verifyToken } from "../../../../../../server/lib/auth";
import connectDB from "../../../../../../server/config/db";
import Hospital from "../../../../../../server/models/Hospital";

// PATCH /api/admin/hospitals/[id] — update hospital info (name, address, timings, etc.)
// Only the admin of THAT hospital can update it
export async function PATCH(req, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return Response.json({ error: "Please log in first" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return Response.json({ error: "Session expired" }, { status: 401 });

    const { id } = await context.params;

    // Security: admin can only edit their own hospital
    if (payload.adminHospitalId !== id) {
      return Response.json({ error: "You can only edit your own hospital" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const updated = await Hospital.findByIdAndUpdate(id, body, { new: true });

    return Response.json(updated);
  } catch (err) {
    console.error("Update hospital error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
