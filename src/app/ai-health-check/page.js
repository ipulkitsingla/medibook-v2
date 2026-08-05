"use client";

import React, { useState, useRef } from "react";
import RiskGauge from "../../components/charts/RiskGauge";
import ShapBarChart from "../../components/charts/ShapBarChart";
import PdfReportGenerator from "../../components/PdfReportGenerator";
import { useRouter } from "next/navigation";

const DISEASES = {
  "Heart Disease": [
    { key: "age", label: "Age (Years)", type: "number" },
    { key: "sex", label: "Biological Sex", type: "select", options: [{ label: "Male", value: 1 }, { label: "Female", value: 0 }] },
    { key: "cp", label: "Chest Pain Type", type: "select", options: [{ label: "Typical Angina", value: 0 }, { label: "Atypical Angina", value: 1 }, { label: "Non-anginal Pain", value: 2 }, { label: "Asymptomatic", value: 3 }] },
    { key: "trestbps", label: "Resting Blood Pressure (mm Hg)", type: "number" },
    { key: "chol", label: "Serum Cholesterol (mg/dl)", type: "number" },
    { key: "fbs", label: "Fasting Blood Sugar > 120 mg/dl", type: "select", options: [{ label: "False", value: 0 }, { label: "True", value: 1 }] },
    { key: "restecg", label: "Resting ECG Results", type: "select", options: [{ label: "Normal", value: 0 }, { label: "ST-T Wave Abnormality", value: 1 }, { label: "Left Ventricular Hypertrophy", value: 2 }] },
    { key: "thalach", label: "Maximum Heart Rate Achieved", type: "number" },
    { key: "exang", label: "Exercise Induced Angina", type: "select", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
    { key: "oldpeak", label: "ST Depression Induced by Exercise", type: "number" },
    { key: "slope", label: "Slope of Peak Exercise ST Segment", type: "select", options: [{ label: "Upsloping", value: 0 }, { label: "Flat", value: 1 }, { label: "Downsloping", value: 2 }] },
    { key: "ca", label: "Number of Major Vessels (0-3)", type: "number" },
    { key: "thal", label: "Thalassemia", type: "select", options: [{ label: "Normal", value: 1 }, { label: "Fixed Defect", value: 2 }, { label: "Reversible Defect", value: 3 }] }
  ],
  "Diabetes": [
    { key: "Pregnancies", label: "Number of Pregnancies", type: "number" },
    { key: "Glucose", label: "Plasma Glucose Concentration", type: "number" },
    { key: "BloodPressure", label: "Diastolic Blood Pressure (mm Hg)", type: "number" },
    { key: "SkinThickness", label: "Triceps Skin Fold Thickness (mm)", type: "number" },
    { key: "Insulin", label: "2-Hour Serum Insulin (mu U/ml)", type: "number" },
    { key: "BMI", label: "Body Mass Index (BMI)", type: "number" },
    { key: "DiabetesPedigreeFunction", label: "Diabetes Pedigree Function (Genetics)", type: "number" },
    { key: "Age", label: "Age (Years)", type: "number" }
  ],
  "Liver Disease": [
    { key: "Age", label: "Age (Years)", type: "number" },
    { key: "Gender", label: "Biological Sex", type: "select", options: [{ label: "Male", value: 1 }, { label: "Female", value: 0 }] },
    { key: "Total_Bilirubin", label: "Total Bilirubin (mg/dL)", type: "number" },
    { key: "Direct_Bilirubin", label: "Direct Bilirubin (mg/dL)", type: "number" },
    { key: "Alkaline_Phosphotase", label: "Alkaline Phosphatase (IU/L)", type: "number" },
    { key: "Alamine_Aminotransferase", label: "Alamine Aminotransferase (SGPT) (IU/L)", type: "number" },
    { key: "Aspartate_Aminotransferase", label: "Aspartate Aminotransferase (SGOT) (IU/L)", type: "number" },
    { key: "Total_Protiens", label: "Total Proteins (g/dL)", type: "number" },
    { key: "Albumin", label: "Albumin (g/dL)", type: "number" },
    { key: "Albumin_and_Globulin_Ratio", label: "Albumin to Globulin Ratio", type: "number" }
  ],
  "Parkinson's": [
    { key: "MDVP:Fo(Hz)", label: "Avg Fundamental Frequency (Hz)", type: "number" },
    { key: "MDVP:Fhi(Hz)", label: "Max Fundamental Frequency (Hz)", type: "number" },
    { key: "MDVP:Flo(Hz)", label: "Min Fundamental Frequency (Hz)", type: "number" },
    { key: "MDVP:Jitter(%)", label: "Jitter (Percentage)", type: "number" },
    { key: "MDVP:Jitter(Abs)", label: "Jitter (Absolute)", type: "number" },
    { key: "MDVP:RAP", label: "Relative Amplitude Perturbation", type: "number" },
    { key: "MDVP:PPQ", label: "Five-point Period Perturbation", type: "number" },
    { key: "Jitter:DDP", label: "Average Absolute Difference of Differences", type: "number" },
    { key: "MDVP:Shimmer", label: "Shimmer", type: "number" },
    { key: "MDVP:Shimmer(dB)", label: "Shimmer (dB)", type: "number" },
    { key: "Shimmer:APQ3", label: "Amplitude Perturbation Quotient (3-point)", type: "number" },
    { key: "Shimmer:APQ5", label: "Amplitude Perturbation Quotient (5-point)", type: "number" },
    { key: "MDVP:APQ", label: "Amplitude Perturbation Quotient (11-point)", type: "number" },
    { key: "Shimmer:DDA", label: "Average Absolute Differences between Amplitudes", type: "number" },
    { key: "NHR", label: "Noise-to-Harmonic Ratio", type: "number" },
    { key: "HNR", label: "Harmonic-to-Noise Ratio", type: "number" },
    { key: "RPDE", label: "Nonlinear Dynamical Complexity", type: "number" },
    { key: "DFA", label: "Signal Fractal Scaling Exponent", type: "number" },
    { key: "spread1", label: "Fundamental Frequency Variation 1", type: "number" },
    { key: "spread2", label: "Fundamental Frequency Variation 2", type: "number" },
    { key: "D2", label: "Correlation Dimension", type: "number" },
    { key: "PPE", label: "Pitch Period Entropy", type: "number" }
  ]
};

export default function AIHealthCheck() {
  const router = useRouter();
  const reportRef = useRef(null);
  
  const [selectedDisease, setSelectedDisease] = useState("Heart Disease");
  
  // Initialize form data with default values for select fields
  const initializeFormData = (disease) => {
    const defaultData = {};
    DISEASES[disease].forEach(field => {
      if (field.type === "select") {
        defaultData[field.key] = field.options[0].value;
      }
    });
    return defaultData;
  };
  
  const [formData, setFormData] = useState(initializeFormData("Heart Disease"));
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  // Use a hardcoded user ID for demo purposes, in production fetch from auth context
  const mockUserId = "60d0fe4f5311236168a109ca";

  const handleInputChange = (e) => {
    const val = e.target.value;
    setFormData({ 
      ...formData, 
      [e.target.name]: val === '' ? undefined : parseFloat(val) 
    });
  };

  const handleDiseaseChange = (e) => {
    const disease = e.target.value;
    setSelectedDisease(disease);
    setFormData(initializeFormData(disease)); // Reset form with proper defaults
    setReport(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Clean up undefined fields before sending
    const cleanedFeatures = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined) {
        cleanedFeatures[key] = formData[key];
      }
    });

    try {
      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: mockUserId,
          disease: selectedDisease,
          features: cleanedFeatures
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate prediction");
      
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    // Navigate to appointment booking page with pre-filled department
    if (report && report.recommendedDepartment) {
      router.push(`/patient-portal?department=${report.recommendedDepartment}`);
    } else {
      router.push(`/patient-portal`);
    }
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <h1 className="ai-title">AI Health Check</h1>
        <p className="ai-subtitle">
          Get instant, AI-powered insights and clinical decision support for early risk detection.
        </p>
      </div>

      <div className="ai-grid">
        {/* Input Form Column */}
        <div className="ai-card">
          <h2 className="ai-card-title">Patient Parameters</h2>
          <form onSubmit={handleSubmit}>
            <div className="ai-form-group">
              <label className="ai-label">Select Disease</label>
              <select 
                value={selectedDisease}
                onChange={handleDiseaseChange}
                className="ai-input"
              >
                {Object.keys(DISEASES).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            
            <div className="ai-scrollable">
              {DISEASES[selectedDisease].map(field => (
                <div key={field.key} className="ai-form-group">
                  <label className="ai-label">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.key}
                      value={formData[field.key] !== undefined ? formData[field.key] : field.options[0].value}
                      onChange={handleInputChange}
                      className="ai-input"
                    >
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="number"
                      step="any"
                      name={field.key}
                      value={formData[field.key] !== undefined ? formData[field.key] : ''}
                      onChange={handleInputChange}
                      className="ai-input"
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="ai-btn-primary"
            >
              {loading ? "Analyzing..." : "Generate AI Prediction"}
            </button>
          </form>
          {error && <p className="ai-error">{error}</p>}
        </div>

        {/* Results Column */}
        <div>
          {report ? (
            <div ref={reportRef} className="ai-card" style={{ position: 'relative', overflow: 'hidden' }}>
              
              {/* Decorative blobs */}
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '192px', height: '192px', background: 'rgba(96, 165, 250, 0.1)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
              <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '192px', height: '192px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}></div>

              {report.riskScore > 95 && (
                <div className="ai-alert-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ width: '24px', height: '24px', marginRight: '8px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Emergency Alert: Extremely High Risk! Please consult a doctor immediately.
                </div>
              )}
              
              {/* Header */}
              <div className="ai-results-header">
                <div>
                  <h2 className="ai-results-title">{report.disease} Assessment</h2>
                  <div className="ai-meta" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}><svg style={{ width: '16px', height: '16px', marginRight: '4px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {new Date(report.createdAt).toLocaleString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center' }}><svg style={{ width: '16px', height: '16px', marginRight: '4px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg> v{report.modelVersion}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span className={`ai-badge ${
                    report.riskCategory === 'High' ? 'ai-badge-high' : 
                    report.riskCategory === 'Moderate' ? 'ai-badge-moderate' : 
                    'ai-badge-low'
                  }`} style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    {report.prediction}
                  </span>
                  <p className="ai-meta" style={{ marginTop: '0.5rem', background: '#f9fafb', padding: '4px 12px', borderRadius: '8px' }}>
                    AI Confidence: <strong style={{ color: '#111827' }}>{report.confidence}%</strong>
                  </p>
                </div>
              </div>

              {/* Dashboard Metrics */}
              <div className="ai-metrics-grid">
                <div className="ai-metric-box">
                  <h3 className="ai-metric-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ width: '20px', height: '20px', marginRight: '8px', color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Risk Gauge
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                    <RiskGauge score={report.riskScore} />
                  </div>
                </div>
                
                <div className="ai-metric-box">
                  <h3 className="ai-metric-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ width: '20px', height: '20px', marginRight: '8px', color: '#a855f7' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    AI Explainability
                  </h3>
                  <div style={{ marginTop: '8px' }}>
                    <ShapBarChart shapValues={report.shapValues.slice(0, 5)} />
                  </div>
                </div>
              </div>

              {/* Top Factors & Recommendations */}
              <div className="ai-factors-grid">
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #f3f4f6', position: 'relative', overflow: 'hidden' }}>
                  <h3 className="ai-card-title" style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '8px', marginBottom: '16px' }}>Top Impact Factors</h3>
                  <ul className="ai-factors-list">
                    {report.topFactors.map((factor, idx) => (
                      <li key={idx} className="ai-factor-item" style={{ background: 'rgba(249, 250, 251, 0.5)', padding: '12px', borderRadius: '12px', transition: 'background-color 0.2s ease', display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <span className={`ai-factor-icon ${factor.impact > 0 ? 'ai-factor-up' : 'ai-factor-down'}`} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {factor.impact > 0 ? (
                            <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                          ) : (
                            <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                          )}
                        </span>
                        <span className="ai-factor-text" style={{ lineHeight: '1.25', paddingTop: '6px' }}>{factor.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div style={{ background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff)', borderRadius: '16px', padding: '24px', border: '1px solid #e0e7ff', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '96px', height: '96px', background: 'rgba(191, 219, 254, 0.3)', borderRadius: '50%', filter: 'blur(24px)' }}></div>
                  <h3 className="ai-card-title" style={{ borderBottom: '1px solid rgba(191, 219, 254, 0.5)', paddingBottom: '8px', marginBottom: '16px', position: 'relative', zIndex: 10 }}>Clinical Recommendations</h3>
                  <div style={{ marginBottom: '16px', background: 'rgba(255, 255, 255, 0.7)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.5)', position: 'relative', zIndex: 10 }}>
                    <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
                      Recommended Department:<br/>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#4338ca' }}>{report.recommendedDepartment}</span>
                    </p>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, position: 'relative', zIndex: 10 }}>
                    {report.recommendations.map((rec, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '14px', color: '#374151', marginBottom: '12px' }}>
                        <svg style={{ width: '20px', height: '20px', color: '#6366f1', marginRight: '8px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span style={{ paddingTop: '2px' }}>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="ai-actions" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
                <PdfReportGenerator targetRef={reportRef} reportName={`${report.disease}_Report.pdf`} />
                <button 
                  onClick={handleBookAppointment}
                  className="ai-btn-success"
                  style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(to right, #10b981, #059669)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '12px 24px', borderRadius: '12px' }}
                >
                  <svg style={{ width: '20px', height: '20px', marginRight: '8px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Book Appointment
                </button>
              </div>

              {/* Disclaimer */}
              <div className="ai-disclaimer">
                "This AI prediction is intended for educational and clinical decision-support purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment."
              </div>

            </div>
          ) : (
            <div className="ai-card ai-empty-state">
              <svg className="ai-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Select a disease and enter parameters to generate an AI report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
