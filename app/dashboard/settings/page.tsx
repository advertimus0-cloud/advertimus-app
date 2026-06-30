import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/authService";
import { getUserCredits } from "@/lib/services/supabaseService";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const userResult = await getCurrentUser();
  if (!userResult.data) {
    redirect("/login");
  }

  const creditsResult = await getUserCredits(userResult.data.id);

  return (
    <SettingsForm
      email={userResult.data.email ?? ""}
      company={userResult.data.company ?? ""}
      credits={creditsResult.data ?? 0}
    />
  );
}
