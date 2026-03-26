import { cookies } from "next/headers";
import { verifyToken } from "../../../../../server/lib/auth";
import connectDB from "../../../../../server/config/db";
import Hospital from "../../../../../server/models/Hospital";

// GET /api/admin-auth/me
// The dashboard calls this on load to check if the admin is logged in
// If not logged in, returns 401 and the frontend redirects to login page
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    // Verify the token is valid and not expired
    const payload = await verifyToken(token);
    if (!payload) {
      return Response.json({ error: "Session expired, please log in again" }, { status: 401 });
    }

    await connectDB();
    const hospital = await Hospital.findById(payload.adminHospitalId);
    if (!hospital) {
      return Response.json({ error: "Hospital not found" }, { status: 404 });
    }

    return Response.json({
      _id:         hospital._id.toString(),
      name:        hospital.name,
      address:     hospital.address,
      phone:       hospital.phone,
      openTime:    hospital.openTime,
      closeTime:   hospital.closeTime,
      departments: hospital.departments,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
