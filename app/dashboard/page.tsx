import MainLayout from "../../components/MainLayout";

/**
 * Dashboard root page — /dashboard
 *
 * Renders the full 3-column chat application (Sidebar | ChatArea | ResultsPanel).
 * MainLayout owns the client-side layout state (sidebar open/closed, results panel).
 */
export default function DashboardPage() {
  return <MainLayout />;
}
