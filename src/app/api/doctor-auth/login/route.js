import connectDB from "../../../../../server/config/db";
import DoctorAuth from "../../../../../server/models/DoctorAuth";
import Doctor from "../../../../../server/models/Doctor";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../../server/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 });
    }

    const auth = await DoctorAuth.findOne({ email: email.toLowerCase() });
    if (!auth) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, auth.password);
    if (!valid) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const doctor = await Doctor.findById(auth.doctorId).populate("hospitalId");
    const token = await signToken({ doctorId: auth.doctorId.toString(), email: auth.email });

    const cookieStore = await cookies();
    cookieStore.set("doctor_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return Response.json({
      doctor: {
        _id: doctor._id.toString(),
        name: doctor.name,
        specialization: doctor.specialization,
        hospitalName: doctor.hospitalId?.name || "",
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
