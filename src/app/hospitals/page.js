"use client";

import { useEffect, useState } from "react";
import HospitalCard from "../../components/HospitalCard";
import HospitalCardSkeleton from "../../components/skeletons/HospitalCardSkeleton";

const PAGE_SIZE = 12;

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/hospitals?page=${page}&limit=${PAGE_SIZE}`)
      .then((res) => res.json())
      .then((data) => {
        // API returns array; total comes from X-Total header if we add it,
        // for now just use array length heuristic
        setHospitals(Array.isArray(data) ? data : []);
        setTotal(Array.isArray(data) ? data.length : 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  const filtered = hospitals.filter((h) => {
    const text = search.toLowerCase();
    return (
      h.name?.toLowerCase().includes(text) ||
      h.address?.toLowerCase().includes(text) ||
      h.departments?.some((d) => d.toLowerCase().includes(text))
    );
  });

  return (
    <section className="all-hospitals">
      <h1>All Hospitals</h1>
      <p>Search and choose the best hospital for you</p>

      <input
        type="text"
        className="search-input"
        placeholder="Search by name, location, or department..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); }}
      />

      {!loading && (
        <p>Showing {filtered.length} of {hospitals.length} hospitals</p>
      )}

      <div className="hospital-grid">
        {loading
          ? [1, 2, 3, 4, 5, 6].map((i) => <HospitalCardSkeleton key={i} />)
          : filtered.map((hospital) => (
              <HospitalCard key={hospital._id} hospital={hospital} />
            ))}

        {!loading && filtered.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No hospitals found
          </p>
        )}
      </div>

      {/* FIX 4: Pagination */}
      {!loading && hospitals.length === PAGE_SIZE && (
        <div className="pagination">
          {page > 1 && (
            <button className="page-btn" onClick={() => setPage((p) => p - 1)}>
              ← Previous
            </button>
          )}
          <span className="page-info">Page {page}</span>
          {hospitals.length === PAGE_SIZE && (
            <button className="page-btn" onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          )}
        </div>
      )}
    </section>
  );
}
