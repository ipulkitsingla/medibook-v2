"use client";
// FIX 3: Thin client shell — only navigation/interaction, data comes from server
import { IoIosArrowBack } from "react-icons/io";
import { FaStethoscope } from "react-icons/fa";
import { IoLocationOutline, IoCallOutline, IoTimeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import DoctorCard from "../../../../components/DoctorCard";

export default function DoctorsPageClient({ hospital, doctors }) {
  const router = useRouter();

  return (
    <section className="all-hospitals">
      <div className="back-wrapper">
        <button className="back-btn" onClick={() => router.push("/hospitals")}>
          <IoIosArrowBack className="back-icon" />
          <span>Back to Hospitals</span>
        </button>
      </div>

      <div className="hospital-header">
        <div className="hospital-header-left">
          <div className="hospital-logo">{hospital.name.charAt(0)}</div>
        </div>
        <div className="hospital-header-right">
          <h1>{hospital.name}</h1>
          <p className="hospital-desc">
            {hospital.description ||
              "A leading multi-specialty hospital providing comprehensive healthcare services."}
          </p>
          <div className="hospital-tags">
            {hospital.departments?.map((dep, i) => (
              <span key={i}>{dep}</span>
            ))}
          </div>
          <div className="hospital-meta">
            <span><IoLocationOutline /> {hospital.address}</span>
            <span><IoTimeOutline /> {hospital.openTime} - {hospital.closeTime}</span>
            <span><IoCallOutline /> {hospital.phone}</span>
          </div>
        </div>
      </div>

      <h1><FaStethoscope size={25} /> Our Doctors</h1>
      <p>{doctors.length} doctors available</p>

      <div className="hospital-grid">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            doctor={doctor}
            onBook={() => router.push(`/doctors/${doctor._id}`)}
          />
        ))}
        {doctors.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No doctors found for this hospital
          </p>
        )}
      </div>
    </section>
  );
}
