import connectDB from "../../../../../server/config/db";
import DiagnosisReport from "../../../../../server/models/DiagnosisReport";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const patientId = searchParams.get("patientId");

    const filter = {};
    if (userId) filter.userId = userId;
    if (patientId) filter.patientId = patientId;

    const reports = await DiagnosisReport.find(filter).sort({ createdAt: -1 });

    return Response.json(reports);
  } catch (error) {
    console.error("GET /api/diagnosis/history error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
