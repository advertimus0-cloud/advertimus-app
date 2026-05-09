import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertimus — Dashboard",
  description: "Advertimus AI Marketing Dashboard",
};

/**
 * Dashboard Layout — fully isolated from the marketing site.
 *
 * This layout intentionally renders NO Header, Footer, or any marketing UI.
 * It provides a full-screen shell for the 3-column chat application.
 *
 * Auth enforcement: all /dashboard routes must be protected by middleware
 * (not done here — middleware.ts will guard the entire /dashboard segment).
 *
 * Security: No secrets, no API calls, no user data in this layout.
 * This is a pure structural Server Component.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-background text-white">
      {children}
    </div>
  );
}
