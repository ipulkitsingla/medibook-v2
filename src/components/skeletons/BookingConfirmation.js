"use client";
// FIX 6: Booking confirmation view shown after successful appointment
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";

export default function BookingConfirmation({
  doctor,
  hospital,
  date,
  time,
  patientName,
  patientEmail,
  patientPhone,
  patientReason,
  onBookAnother,
}) {
  const router = useRouter();

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="confirmation-wrapper">
      <div className="confirmation-badge">
        <FaCheckCircle />
        <span>Appointment Confirmed</span>
      </div>
      <div className="confirmation-head">
        <div className="confirmation-avatar">
          <IoPersonOutline />
        </div>
        <div>
          <h2 className="confirmation-title">{doctor?.name}</h2>
          <p className="confirmation-sub">
            Your appointment is booked successfully. See your visit details below.
          </p>
        </div>
      </div>

      <div className="confirmation-card">
        <h3 className="confirmation-section-title">Patient Details</h3>
        <div className="confirmation-grid">
          <div className="confirmation-item">
            <span className="conf-icon">
              <IoPersonOutline />
            </span>
            <div>
              <p className="conf-label">Patient Name</p>
              <p className="conf-value">{patientName || "-"}</p>
            </div>
          </div>
          <div className="confirmation-item">
            <span className="conf-icon">
              <IoMailOutline />
            </span>
            <div>
              <p className="conf-label">Email</p>
              <p className="conf-value">{patientEmail || "-"}</p>
            </div>
          </div>
          <div className="confirmation-item">
            <span className="conf-icon">
              <IoCallOutline />
            </span>
            <div>
              <p className="conf-label">Phone</p>
              <p className="conf-value">{patientPhone || "-"}</p>
            </div>
          </div>
          <div className="confirmation-item">
            <span className="conf-icon">
              <IoCalendarOutline />
            </span>
            <div>
              <p className="conf-label">Date</p>
              <p className="conf-value">{formattedDate}</p>
            </div>
          </div>
          <div className="confirmation-item">
            <span className="conf-icon">
              <IoTimeOutline />
            </span>
            <div>
              <p className="conf-label">Time</p>
              <p className="conf-value">{time}</p>
            </div>
          </div>
          <div className="confirmation-item">
            <span className="conf-icon">
              <IoDocumentTextOutline />
            </span>
            <div>
              <p className="conf-label">Reason for Visit</p>
              <p className="conf-value">{patientReason || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="confirmation-note">
        Please arrive 10-15 minutes before your appointment. Bring a valid ID and any relevant medical records.
      </p>

      <div className="confirmation-actions">
        <button className="btn-primary" onClick={onBookAnother}>
          Book Another Appointment
        </button>
        <button className="btn-outline" onClick={() => router.push("/hospitals")}>
          Back to Hospitals
        </button>
      </div>
    </div>
  );
}
