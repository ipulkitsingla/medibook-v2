import connectDB from "../../../../server/config/db";
import DiagnosisReport from "../../../../server/models/DiagnosisReport";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { userId, patientId, disease, features } = body;

    if (!userId || !disease || !features) {
      return Response.json(
        { error: "userId, disease, and features are required" },
        { status: 400 }
      );
    }

    // Call Python FastAPI service
    const pyResponse = await fetch(`${AI_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disease, features }),
    });

    if (!pyResponse.ok) {
      const errData = await pyResponse.text();
      console.error("AI Service Error:", errData);
      return Response.json(
        { error: "Failed to get prediction from AI service" },
        { status: 502 }
      );
    }

    const aiData = await pyResponse.json();

    // Save to MongoDB
    const reportData = {
      userId,
      patientId,
      disease,
      prediction: aiData.prediction,
      confidence: aiData.confidence,
      riskScore: aiData.riskScore,
      riskCategory: aiData.riskCategory,
      recommendedDepartment: aiData.recommendedDepartment,
      recommendations: aiData.recommendations,
      topFactors: aiData.topFactors,
      shapValues: aiData.shapValues,
      modelVersion: aiData.modelVersion,
    };

    const report = await DiagnosisReport.create(reportData);

    return Response.json(report, { status: 201 });
  } catch (error) {
    console.error("POST /api/diagnosis error:", error.message);
    if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
      return Response.json({ 
        error: "The AI microservice is not running or unreachable. Please ensure the Python FastAPI server is running on port 8000." 
      }, { status: 503 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
