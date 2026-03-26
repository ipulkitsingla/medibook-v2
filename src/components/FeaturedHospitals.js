"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// FIX 5: Deduplicate — reuse HospitalCard instead of inline reimplementation
import HospitalCard from "./HospitalCard";
// FIX 6: Import skeleton
import HospitalCardSkeleton from "./skeletons/HospitalCardSkeleton";

export default function FeaturedHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/hospitals?limit=3")
      .then((res) => res.json())
      .then((data) => {
        setHospitals(Array.isArray(data) ? data.slice(0, 3) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="featured">
      <div className="featured-header">
        <div>
          <h2>Featured Hospitals</h2>
          <p>Top-rated healthcare facilities</p>
        </div>
        <button className="view-all" onClick={() => router.push("/hospitals")}>
          View All →
        </button>
      </div>

      <div className="hospital-grid">
        {/* FIX 6: Show skeletons while loading */}
        {loading ? (
          [1, 2, 3].map((i) => <HospitalCardSkeleton key={i} />)
        ) : (
          hospitals.map((hospital) => (
            <HospitalCard key={hospital._id} hospital={hospital} />
          ))
        )}
      </div>
    </section>
  );
}
