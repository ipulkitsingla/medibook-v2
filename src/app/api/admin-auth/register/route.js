import connectDB from "../../../../../server/config/db";
import AdminAuth from "../../../../../server/models/AdminAuth";
import Hospital from "../../../../../server/models/Hospital";
import bcrypt from "bcryptjs";

/*
  POST /api/admin-auth/register
  Creates login credentials for a hospital admin.
  
  Body: { hospitalId, email, password }
  
  Use this once per hospital to set up the admin account.
  Example with curl:
    curl -X POST http://localhost:3000/api/admin-auth/register \
      -H "Content-Type: application/json" \
      -d '{ "hospitalId": "...", "email": "admin@hospital.com", "password": "mypassword" }'
*/
export async function POST(req) {
  try {
    await connectDB();
    const { hospitalId, email, password } = await req.json();

    // Make sure all fields are provided
    if (!hospitalId || !email || !password) {
      return Response.json(
        { error: "hospitalId, email and password are all required" },
        { status: 400 }
      );
    }

    // Password must be at least 6 characters
    if (password.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check the hospital actually exists in our database
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return Response.json({ error: "Hospital not found" }, { status: 404 });
    }

    // Check if admin credentials already exist for this hospital or email
    const existing = await AdminAuth.findOne({
      $or: [{ email }, { hospitalId }],
    });
    if (existing) {
      return Response.json(
        { error: "Admin account already exists for this hospital or email" },
        { status: 409 }
      );
    }

    // Hash the password before saving (never store plain text passwords)
    const hashedPassword = await bcrypt.hash(password, 10);
    await AdminAuth.create({ hospitalId, email: email.toLowerCase(), password: hashedPassword });

    return Response.json(
      { message: `Admin account created for ${hospital.name}` },
      { status: 201 }
    );
  } catch (err) {
    console.error("Admin register error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
