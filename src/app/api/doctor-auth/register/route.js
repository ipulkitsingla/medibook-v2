import connectDB from "../../../../../server/config/db";
import DoctorAuth from "../../../../../server/models/DoctorAuth";
import Doctor from "../../../../../server/models/Doctor";
import bcrypt from "bcryptjs";

// POST /api/doctor-auth/register
// Body: { doctorId, email, password }
// Used once per doctor to create login credentials
export async function POST(req) {
  try {
    await connectDB();
    const { doctorId, email, password } = await req.json();

    if (!doctorId || !email || !password) {
      return Response.json({ error: "doctorId, email and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return Response.json({ error: "Doctor not found" }, { status: 404 });
    }

    const existing = await DoctorAuth.findOne({ $or: [{ email }, { doctorId }] });
    if (existing) {
      return Response.json({ error: "Credentials already registered for this doctor" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    await DoctorAuth.create({ doctorId, email: email.toLowerCase(), password: hash });

    return Response.json({ message: "Doctor account created successfully" }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
