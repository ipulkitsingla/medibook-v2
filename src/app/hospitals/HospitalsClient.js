"use client";
// FIX 3: Client boundary only for the interactive search — list is server-rendered
import { useState } from "react";
import HospitalCard from "../../components/HospitalCard";

export default function HospitalsClient({ hospitals }) {
  const [search, setSearch] = useState("");

  const filtered = hospitals.filter((h) => {
    const text = search.toLowerCase();
    return (
      h.name?.toLowerCase().includes(text) ||
      h.address?.toLowerCase().includes(text) ||
      h.departments?.some((d) => d.toLowerCase().includes(text))
    );
  });

  return (
    <>
      <input
        type="text"
        className="search-input"
        placeholder="Search by name, location, or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p>Showing {filtered.length} of {hospitals.length} hospitals</p>

      <div className="hospital-grid">
        {filtered.map((hospital) => (
          <HospitalCard key={hospital._id} hospital={hospital} />
        ))}
        {filtered.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No hospitals found
          </p>
        )}
      </div>
    </>
  );
}
