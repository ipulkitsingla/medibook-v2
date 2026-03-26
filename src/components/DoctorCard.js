import { FaCalendarAlt } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";

export default function DoctorCard({ doctor, onBook }) {
  // FIX 1: Guard against missing name or availableDays
  const initials = (doctor.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const availableDays = doctor.availableDays ?? [];

  return (
    <div className="doctor-card">
      <div className="doctor-header">
        {/* FIX 1 + FIX 6: Replace CgProfile icon with coloured initials avatar */}
        <div className="doctor-avatar-initials">{initials}</div>

        <div className="doctor-info">
          <h3>{doctor.name}</h3>
          <p className="specialization"><FaUserDoctor /> {doctor.specialization}</p>
          <p className="experience">{doctor.experience} years experience</p>
        </div>
      </div>

      <div className="doctor-stats">
        <div className="stat-box">
          <span className="label">Consultation Fee</span>
          <strong>₹{doctor.consultationFee}</strong>
        </div>
        <div className="stat-box">
          <span className="label"><IoTime /> Slot Duration</span>
          <strong>{doctor.slotDuration} min</strong>
        </div>
      </div>

      <div className="available-days">
        <span className="label"><FaCalendarAlt /> Available Days</span>
        <div className="days">
          {availableDays.length > 0 ? (
            availableDays.map((day, index) => (
              <span key={index} className="day-pill">{day}</span>
            ))
          ) : (
            <span className="day-pill muted">Not specified</span>
          )}
        </div>
      </div>

      <button className="btn-primary book-btn" onClick={onBook}>
        Book Appointment
      </button>
    </div>
  );
}
