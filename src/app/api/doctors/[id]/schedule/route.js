import { cookies } from "next/headers";
import { verifyToken } from "../../../../../../server/lib/auth";
import connectDB from "../../../../../../server/config/db";
import Doctor from "../../../../../../server/models/Doctor";

// PATCH /api/doctors/[id]/schedule — update availableDays, slotDuration, consultationFee
export async function PATCH(req, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("doctor_token")?.value;
    if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return Response.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await context.params;

    // Doctors can only update their own profile
    if (payload.doctorId !== id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const { availableDays, slotDuration, consultationFee } = await req.json();

    const updated = await Doctor.findByIdAndUpdate(
      id,
      { availableDays, slotDuration, consultationFee },
      { new: true }
    );

    return Response.json(updated);
  } catch (err) {
    console.error("Schedule update error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
