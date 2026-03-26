import { cookies } from "next/headers";
import { verifyToken } from "../../../../../server/lib/auth";
import connectDB from "../../../../../server/config/db";
import Appointment from "../../../../../server/models/Appointment";

// PATCH /api/appointments/[id] — update status (confirmed/cancelled/completed)
export async function PATCH(req, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("doctor_token")?.value;
    if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return Response.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await context.params;
    await connectDB();

    const appointment = await Appointment.findById(id);
    if (!appointment) return Response.json({ error: "Not found" }, { status: 404 });

    // Only the assigned doctor can update
    if (appointment.doctorId.toString() !== payload.doctorId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    const validStatuses = ["confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    appointment.status = status;
    await appointment.save();

    return Response.json(appointment);
  } catch (err) {
    console.error("Appointment update error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
