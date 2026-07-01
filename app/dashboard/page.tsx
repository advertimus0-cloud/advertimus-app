import MainLayout from "../../components/MainLayout";
import { getCurrentUser } from "@/lib/services/authService";
import { getUserCredits } from "@/lib/services/supabaseService";

const TRIAL_CREDIT_LIMIT = 400;

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
      userEmail={user?.email ?? ""}
      userCompany={user?.company ?? ""}
      userFullName={user?.fullName ?? ""}
      userPhone={user?.phone ?? ""}
      userWebsite={user?.website ?? ""}
      tokenUsed={Math.max(0, TRIAL_CREDIT_LIMIT - balance)}
      tokenMax={TRIAL_CREDIT_LIMIT}
      tokenRemaining={balance}
    />
  );
}
