// FIX 6: Skeleton loader matching DoctorCard shape
export default function DoctorCardSkeleton() {
  return (
    <div className="doctor-card skeleton-card">
      <div className="doctor-header">
        <div className="skeleton skeleton-avatar" />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      </div>
      <div className="doctor-stats">
        <div className="skeleton skeleton-stat" />
        <div className="skeleton skeleton-stat" />
      </div>
      <div className="skeleton skeleton-btn" />
    </div>
  );
}
