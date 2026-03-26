import { cookies } from "next/headers";
import { verifyToken } from "../../../../../server/lib/auth";
import connectDB from "../../../../../server/config/db";
import Doctor from "../../../../../server/models/Doctor";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("doctor_token")?.value;
    if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return Response.json({ error: "Invalid token" }, { status: 401 });

    await connectDB();
    const doctor = await Doctor.findById(payload.doctorId).populate("hospitalId");
    if (!doctor) return Response.json({ error: "Doctor not found" }, { status: 404 });

    return Response.json({
      _id: doctor._id.toString(),
      name: doctor.name,
      specialization: doctor.specialization,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      slotDuration: doctor.slotDuration,
      availableDays: doctor.availableDays,
      hospitalId: doctor.hospitalId?._id?.toString(),
      hospitalName: doctor.hospitalId?.name || "",
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
