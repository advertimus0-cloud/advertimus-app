import MainLayout from "../../components/MainLayout";
import { getCurrentUser } from "@/lib/services/authService";
import { getUserCredits } from "@/lib/services/supabaseService";

const TRIAL_CREDIT_LIMIT = 400;

/**
 * Dashboard root page — /dashboard
 *
 * Fetches the authenticated user + credit balance server-side and passes
 * them into MainLayout (pure presentation component) so the sidebar shows
 * real account data instead of "Loading…" placeholders.
 */
export default async function DashboardPage() {
  const userResult = await getCurrentUser();
  const user = userResult.data;

  const balance = user
    ? (await getUserCredits(user.id)).data ?? 0
    : 0;

  const displayName = user?.company || user?.email?.split("@")[0] || "Account";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <MainLayout
      user={{ name: displayName, initials }}
      tokenUsed={Math.max(0, TRIAL_CREDIT_LIMIT - balance)}
      tokenMax={TRIAL_CREDIT_LIMIT}
      tokenRemaining={balance}
    />
  );
}
