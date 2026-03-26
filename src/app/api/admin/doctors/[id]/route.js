import { cookies } from "next/headers";
import { verifyToken } from "../../../../../../server/lib/auth";
import connectDB from "../../../../../../server/config/db";
import Doctor from "../../../../../../server/models/Doctor";

export async function DELETE(req, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return Response.json({ error: "Please log in first" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return Response.json({ error: "Session expired" }, { status: 401 });

    const { id } = await context.params;
    await connectDB();

    const doctor = await Doctor.findById(id);
    if (!doctor) return Response.json({ error: "Doctor not found" }, { status: 404 });

    if (doctor.hospitalId.toString() !== payload.adminHospitalId) {
      return Response.json({ error: "You can only remove doctors from your own hospital" }, { status: 403 });
    }

    doctor.isActive = false;
    await doctor.save();

    return Response.json({ message: `Dr. ${doctor.name} has been removed` });
  } catch (err) {
    console.error("Remove doctor error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
