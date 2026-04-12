"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    // Simulate API delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            boxShadow: "0 0 14px rgba(93,26,27,0.35)",
            background: "linear-gradient(135deg,#161142,#5d1a1b)"
          }}>
            <img src="/adverboticon.jpg" alt="Advertimus" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Advertimus</span>
        </Link>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{
          width: "100%", maxWidth: 440,
          background: "rgba(255,255,255,0.02)",
          borderRadius: 24, padding: "48px 32px",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 0 80px rgba(93,26,27,0.1), 0 0 40px rgba(22,17,66,0.1)",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"
        }}>
          
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(93,26,27,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 24, border: "1px solid rgba(93,26,27,0.5)",
            boxShadow: "0 0 30px rgba(93,26,27,0.2)"
          }}>
            <i className="bx bx-envelope" style={{ fontSize: 40, color: "#cc2936" }} />
          </div>

          <h1 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
            Check your email
          </h1>
          <p style={{ margin: "0 0 32px", fontSize: 15, color: "#9090a8", lineHeight: 1.6 }}>
            We've sent a verification link to your email address. 
            Please check your inbox to activate your account and claim your 400 free trial tokens.
          </p>

          <button 
            onClick={handleVerify}
            disabled={verifying}
            style={{
              width: "100%", padding: "16px", borderRadius: 12, border: "none",
              background: verifying ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#5d1a1b,#161142)",
              color: verifying ? "#5a5a72" : "#fff",
              fontSize: 16, fontWeight: 600, cursor: verifying ? "default" : "pointer",
              transition: "all 0.2s",
              boxShadow: verifying ? "none" : "0 4px 14px rgba(93,26,27,0.3)",
              display: "flex", justifyContent: "center", alignItems: "center", gap: 10
            }}
          >
            {verifying ? (
              <>
                <i className="bx bx-loader-alt bx-spin" style={{ fontSize: 20 }} />
                Verifying...
              </>
            ) : (
              "Open Email App (Mock Verify)"
            )}
          </button>

          <div style={{ marginTop: 24 }}>
            <button style={{ 
              background: "transparent", border: "none", color: "#9090a8", 
              fontSize: 14, fontWeight: 500, cursor: "pointer" 
            }}>
              Didn't receive an email? <span style={{ color: "#fff", textDecoration: "underline" }}>Resend</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
