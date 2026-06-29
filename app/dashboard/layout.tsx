import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Advertimus — Dashboard",
  description: "Advertimus AI Marketing Dashboard",
};

/**
 * Dashboard Layout — server-side auth guard (defense-in-depth alongside middleware).
 * Any unauthenticated request that somehow bypasses middleware is caught here.
 *
 * Security: uses getUser() which validates with the Supabase auth server.
 * Never use getSession() for auth checks (only reads JWT locally).
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Guard: if Supabase is not configured, skip auth check
  if (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-background text-white">
      {children}
    </div>
  );
}
