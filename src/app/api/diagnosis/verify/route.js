import connectDB from "../../../../../server/config/db";
import DiagnosisReport from "../../../../../server/models/DiagnosisReport";

export async function POST(req) {
  try {
    await connectDB();
    const { reportId, doctorNotes } = await req.json();

    if (!reportId) {
      return Response.json({ error: "reportId is required" }, { status: 400 });
    }

    const report = await DiagnosisReport.findByIdAndUpdate(
      reportId,
      { doctorVerified: true, doctorNotes: doctorNotes || "" },
      { new: true }
    );

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    return Response.json(report);
  } catch (error) {
    console.error("POST /api/diagnosis/verify error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
