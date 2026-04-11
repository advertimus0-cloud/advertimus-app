import React from "react";

// Full-screen dashboard shell — no outer padding, no extra wrappers.
// The 3-column layout is owned by each page via MainLayout.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#0d0d12" }}>
      {children}
    </div>
  );
}
