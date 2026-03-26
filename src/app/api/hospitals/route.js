import connectDB from "../../../../server/config/db";
import {
  createHospital,
  getHospitals,
} from "../../../../server/routes/hospital.route";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const hospital = await createHospital(body);
    return Response.json(hospital, { status: 201 });
  } catch (error) {
    console.error("POST /api/hospitals error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "0", 10);
    const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const hospitals = await getHospitals({ limit, page });
    return Response.json(hospitals);
  } catch (error) {
    console.error("GET /api/hospitals error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
