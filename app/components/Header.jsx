"use client";

import { useState } from "react";

export default function Header() {
  // NOTE: هذا للـ dropdown تبع Product
  const [isProductOpen, setIsProductOpen] = useState(false);

  return (
    <header className="adv-header">
      <div className="adv-container">
        <div className="adv-header-shell">
          <div className="adv-header-content">
            {/* ======================= */}
            {/* LOGO AREA               */}
            {/* ======================= */}
            <div className="adv-header-logo-wrap">
              <img
                src="/advertimus-logo.png"
                alt="Advertimus Logo"
                className="adv-header-logo"
              />
            </div>

            {/* ======================= */}
            {/* NAV LINKS + DROPDOWN    */}
            {/* ======================= */}
            <nav className="adv-nav">
              <div className="adv-nav-item">
                <button
                  className="adv-nav-link adv-nav-button"
                  onClick={() => setIsProductOpen((v) => !v)}
                >
                  <span>Product</span>
                  <span className="adv-nav-caret">
                    {isProductOpen ? "▴" : "▾"}
                  </span>
                </button>

                {isProductOpen && (
                  <div className="adv-dropdown">
                    <button className="adv-dropdown-link">
                      <i className="bx bx-movie-play adv-dropdown-icon" />
                      AI Video Ad Generator
                    </button>
                    <button className="adv-dropdown-link">
                      <i className="bx bx-image-alt adv-dropdown-icon" />
                      AI Image Ad Generator
                    </button>
                    <button className="adv-dropdown-link">
                      <i className="bx bx-edit adv-dropdown-icon" />
                      Ad Copy & Hooks
                    </button>
                    <button className="adv-dropdown-link">
                      <i className="bx bx-line-chart adv-dropdown-icon" />
                      Performance Insights
                    </button>
                  </div>
                )}
              </div>

              <button className="adv-nav-link">Solutions</button>
              <button className="adv-nav-link">Resources</button>
            </nav>

            {/* ======================= */}
            {/* RIGHT SIDE BUTTONS      */}
            {/* ======================= */}
            <div className="adv-header-actions">
              <button className="adv-header-login">Sign In</button>
              <button className="adv-header-cta">
                Try Free <span className="adv-cta-arrow">→</span>
              </button>
            </div>

            {/* ======================= */}
            {/* MOBILE BURGER BUTTON    */}
            {/* ======================= */}
            {/* NOTE: هاي هي أيقونة المنيو للموبايل فقط، */
            /*       رح نعرضها بالـ CSS على الشاشات الصغيرة */}
            <button className="adv-burger" aria-label="Open navigation">
              <i className="bx bx-menu"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
