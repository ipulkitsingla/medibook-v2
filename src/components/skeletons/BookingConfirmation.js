"use client";
// FIX 6: Booking confirmation view shown after successful appointment
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

export default function BookingConfirmation({ doctor, hospital, date, time, onBookAnother }) {
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
      <div className="confirmation-icon">
        <FaCheckCircle />
      </div>
      <h2 className="confirmation-title">Appointment Confirmed!</h2>
      <p className="confirmation-sub">
        Your appointment has been booked successfully.
      </p>

      <div className="confirmation-card">
        <div className="confirmation-row">
          <span className="conf-label">Doctor</span>
          <span className="conf-value">{doctor?.name}</span>
        </div>
        <div className="confirmation-row">
          <span className="conf-label">Specialization</span>
          <span className="conf-value">{doctor?.specialization}</span>
        </div>
        <div className="confirmation-row">
          <span className="conf-label">Hospital</span>
          <span className="conf-value">{hospital?.name}</span>
        </div>
        <div className="confirmation-row">
          <span className="conf-label">Date</span>
          <span className="conf-value">{formattedDate}</span>
        </div>
        <div className="confirmation-row">
          <span className="conf-label">Time</span>
          <span className="conf-value">{time}</span>
        </div>
      </div>

      <p className="confirmation-note">
        Please arrive 10–15 minutes before your appointment. Bring a valid ID and any relevant medical records.
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
