export const metadata = {
  title: "Hospital Admin — MediBook",
};

// No navbar/footer here — the admin panel is a standalone page
export default function AdminLayout({ children }) {
  return <>{children}</>;
}
