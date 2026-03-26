// FIX 6: Skeleton loader matching HospitalCard shape
export default function HospitalCardSkeleton() {
  return (
    <div className="hospital-card skeleton-card">
      <div className="hospital-top">
        <div className="skeleton skeleton-icon" />
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="skeleton skeleton-tag" />
          <div className="skeleton skeleton-tag" />
        </div>
      </div>
      <div className="hospital-content">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line short" />
      </div>
      <div className="skeleton skeleton-btn" />
    </div>
  );
}
