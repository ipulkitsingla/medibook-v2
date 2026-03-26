import { cookies } from "next/headers";
import { verifyToken } from "../../../../../server/lib/auth";
import connectDB from "../../../../../server/config/db";
import Doctor from "../../../../../server/models/Doctor";
import DoctorAuth from "../../../../../server/models/DoctorAuth";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return Response.json({ error: "Please log in first" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return Response.json({ error: "Session expired" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    if (!body.name?.trim()) {
      return Response.json({ error: "Doctor name is required" }, { status: 400 });
    }

    const doctor = await Doctor.create({
      ...body,
      hospitalId: payload.adminHospitalId,
      isActive: true,
    });

    if (body.loginEmail && body.loginPassword) {
      if (body.loginPassword.length >= 6) {
        const hash = await bcrypt.hash(body.loginPassword, 10);
        await DoctorAuth.create({
          doctorId: doctor._id,
          email: body.loginEmail.toLowerCase(),
          password: hash,
        });
      }
    }

    return Response.json(doctor, { status: 201 });
  } catch (err) {
    console.error("Add doctor error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
