"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to verify email
    if (email && password.length >= 8 && agreed) {
      router.push("/verify-email");
    }
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
        <Link href="/login" style={{ color: "#9090a8", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
          Already have an account? <span style={{ color: "#fff" }}>Sign in</span>
        </Link>
      </div>

      {/* Main Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{
          width: "100%", maxWidth: 440,
          background: "rgba(255,255,255,0.02)",
          borderRadius: 24, padding: "40px 32px",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 0 80px rgba(93,26,27,0.1), 0 0 40px rgba(22,17,66,0.1)"
        }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: "-0.02em" }}>Create your account</h1>
          <p style={{ margin: "0 0 32px", fontSize: 15, color: "#9090a8", textAlign: "center" }}>Start your 7-day free trial. No credit card required.</p>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>Work Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sarah@leathergoods.com"
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12,
                  background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: 15, outline: "none", transition: "border 0.2s"
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>Company Name (Optional)</label>
              <input 
                type="text" 
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Sarah's Leather Co."
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12,
                  background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: 15, outline: "none", transition: "border 0.2s"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12,
                  background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: 15, outline: "none", transition: "border 0.2s"
                }}
                required
                minLength={8}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 4 }}>
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                id="terms"
                style={{ marginTop: 4, width: 16, height: 16, cursor: "pointer", accentColor: "#cc2936" }}
              />
              <label htmlFor="terms" style={{ fontSize: 13, color: "#9090a8", lineHeight: 1.5, cursor: "pointer" }}>
                I agree to Advertimus's <a href="#" style={{ color: "#fff", textDecoration: "underline" }}>Terms of Service</a> and <a href="#" style={{ color: "#fff", textDecoration: "underline" }}>Privacy Policy</a>.
              </label>
            </div>

            <button 
              type="submit"
              disabled={!email || password.length < 8 || !agreed}
              style={{
                marginTop: 12, padding: "16px", borderRadius: 12, border: "none",
                background: (email && password.length >= 8 && agreed) ? "linear-gradient(135deg,#5d1a1b,#161142)" : "rgba(255,255,255,0.05)",
                color: (email && password.length >= 8 && agreed) ? "#fff" : "#5a5a72",
                fontSize: 16, fontWeight: 600, cursor: (email && password.length >= 8 && agreed) ? "pointer" : "default",
                transition: "all 0.2s",
                boxShadow: (email && password.length >= 8 && agreed) ? "0 4px 14px rgba(93,26,27,0.3)" : "none"
              }}
            >
              Start Free Trial
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
