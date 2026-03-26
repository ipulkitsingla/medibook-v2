"use client";

import { IoIosArrowBack } from "react-icons/io";
import { FaStethoscope } from "react-icons/fa";
import { IoLocationOutline, IoCallOutline, IoTimeOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DoctorCard from "../../../../components/DoctorCard";
import DoctorCardSkeleton from "../../../../components/skeletons/DoctorCardSkeleton";

export default function DoctorsPage() {
  const { hospitalId } = useParams();
  const router = useRouter();

  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: parallel fetch instead of waterfall
    Promise.all([
      fetch(`/api/hospitals/${hospitalId}`).then((r) => r.json()),
      fetch(`/api/doctors?hospitalId=${hospitalId}`).then((r) => r.json()),
    ])
      .then(([hospitalData, doctorsData]) => {
        setHospital(hospitalData);
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [hospitalId]);

  return (
    <section className="all-hospitals">
      <div className="back-wrapper">
        <button className="back-btn" onClick={() => router.push("/hospitals")}>
          <IoIosArrowBack className="back-icon" />
          <span>Back to Hospitals</span>
        </button>
      </div>

      {/* Hospital header — skeleton while loading */}
      {loading ? (
        <div className="hospital-header" style={{ marginBottom: 32 }}>
          <div className="skeleton" style={{ width: 72, height: 72, borderRadius: 14 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-title" style={{ width: "40%", marginBottom: 12 }} />
            <div className="skeleton skeleton-line" style={{ width: "70%" }} />
            <div className="skeleton skeleton-line short" style={{ width: "50%" }} />
          </div>
        </div>
      ) : hospital && (
        <div className="hospital-header">
          <div className="hospital-header-left">
            <div className="hospital-logo">{hospital.name?.charAt(0)}</div>
          </div>
          <div className="hospital-header-right">
            <h1>{hospital.name}</h1>
            <p className="hospital-desc">
              {hospital.description ||
                "A leading multi-specialty hospital providing comprehensive healthcare services."}
            </p>
            <div className="hospital-tags">
              {hospital.departments?.map((dep, i) => <span key={i}>{dep}</span>)}
            </div>
            <div className="hospital-meta">
              <span><IoLocationOutline /> {hospital.address}</span>
              <span><IoTimeOutline /> {hospital.openTime} - {hospital.closeTime}</span>
              <span><IoCallOutline /> {hospital.phone}</span>
            </div>
          </div>
        </div>
      )}

      <h1><FaStethoscope size={22} /> Our Doctors</h1>
      {!loading && <p>{doctors.length} doctors available</p>}

      <div className="hospital-grid">
        {loading
          ? [1, 2, 3].map((i) => <DoctorCardSkeleton key={i} />)
          : doctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onBook={() => router.push(`/doctors/${doctor._id}`)}
              />
            ))}

        {!loading && doctors.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No doctors found for this hospital
          </p>
        )}
      </div>
    </section>
  );
}
