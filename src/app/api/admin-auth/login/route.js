import connectDB from "../../../../../server/config/db";
import AdminAuth from "../../../../../server/models/AdminAuth";
import Hospital from "../../../../../server/models/Hospital";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../../server/lib/auth";
import { cookies } from "next/headers";

// POST /api/admin-auth/login
// Checks email + password, then sets a secure cookie so the admin stays logged in
export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find the admin account by email
    const auth = await AdminAuth.findOne({ email: email.toLowerCase() });
    if (!auth) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare the entered password against the stored hash
    const isCorrect = await bcrypt.compare(password, auth.password);
    if (!isCorrect) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Get the hospital details to return to the frontend
    const hospital = await Hospital.findById(auth.hospitalId);

    // Create a JWT token that contains the admin's hospitalId
    const token = await signToken({
      adminHospitalId: auth.hospitalId.toString(),
      email: auth.email,
    });

    // Store the token in an httpOnly cookie (can't be read by JavaScript — safer)
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // stay logged in for 7 days
      path: "/",
    });

    return Response.json({
      hospital: {
        _id: hospital._id.toString(),
        name: hospital.name,
        address: hospital.address,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
