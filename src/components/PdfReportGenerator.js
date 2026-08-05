"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PdfReportGenerator({ targetRef, reportName = "Diagnosis_Report.pdf" }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async () => {
    if (!targetRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(targetRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(reportName);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF report.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePdf}
      disabled={isGenerating}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow transition disabled:opacity-50"
    >
      {isGenerating ? "Generating..." : "Download PDF Report"}
    </button>
  );
}
