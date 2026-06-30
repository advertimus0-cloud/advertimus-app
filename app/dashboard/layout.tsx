import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Advertimus — Dashboard",
  description: "Advertimus AI Marketing Dashboard",
};

/**
 * Dashboard Layout — server-side auth guard (defense-in-depth alongside middleware).
 * This is the true enforcement point: middleware fails open on errors, so any
 * unauthenticated or unverifiable request must be rejected here.
 *
 * Security: uses getUser() which validates with the Supabase auth server.
 * Never use getSession() for auth checks (only reads JWT locally).
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | null = null;

  try {
    const supabase = createClient();
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  } catch (err) {
    console.error("[dashboard/layout] auth check failed:", err);
  }

  // redirect() throws internally — must run outside the try/catch above
  // so it isn't swallowed and re-triggered by our own catch block.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-background text-white">
      {children}
    </div>
  );
}
