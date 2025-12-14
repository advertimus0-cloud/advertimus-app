"use client";

// ===============================
// ✅ Home Page (تصميم فقط)
// - كلشي JSX + CSS بنفس الملف
// - نوتس بالعربي داخل الكود
// ===============================

import React, { useMemo, useState } from "react";
import { IconBox } from "./components/IconBox";

export default function HomePage() {
  // ===============================
  // ✅ FAQ: فتح/إغلاق سؤال واحد (بالكبس)
  // ===============================
  const [openIndex, setOpenIndex] = useState<number | null>(2);

  // ===============================
  // ✅ FAQ content (عدّل من هون إذا بدك)
  // ===============================
  const faqItems = useMemo(
    () => [
      {
        q: "Is Advertimus building real ads or just mockups?",
        a: "Advertimus is built to create real, market-ready ads — structured, intentional, and designed for real-world performance, not demos.",
      },
      {
        q: "What can I use on Advertimus today?",
        a: "Right now, Advertimus lets you create complete advertising content — copy, structure, and creatives — ready to be used in real campaigns.",
      },
      {
        q: "What is Advertimus iQ?",
        a: "Advertimus iQ is our upcoming intelligent ad management system, built to automate, optimize, and control advertising performance at scale.",
      },
      {
        q: "Is Advertimus iQ available now?",
        a: "Not yet. Advertimus iQ is currently under development and will launch soon.",
      },
      {
        q: "Will Advertimus manage my ads automatically?",
        a: "Ad management and optimization will be handled by Advertimus iQ once it launches. For now, you get market-ready ad content you can deploy immediately.",
      },
      {
        q: "Why start with ad creation first?",
        a: "Because strong performance starts with strong ads. We’re building Advertimus step by step — creation first, management next.",
      },
    ],
    []
  );

  return (
    <>
      {/* ===============================
        ✅ Shooting Stars Layer (على كل الصفحة)
        - زدنا العدد
        - في شهب بتمر من النص (المناطق الوسط)
      =============================== */}
      <div className="shooting-stars" aria-hidden="true">
        <span className="star s1" />
        <span className="star s2" />
        <span className="star s3" />
        <span className="star s4" />
        <span className="star s5" />
        <span className="star s6" />
        <span className="star s7" />
        <span className="star s8" />
        <span className="star s9" />
        <span className="star s10" />
        <span className="star s11" />
        <span className="star s12" />
      </div>

      {/* ===============================
        ✅ HERO SECTION
      =============================== */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* ===== Hero Text ===== */}
            <div className="hero-text">
              {/* ✅ Badge (Solid Red) */}
              {/* نوتس: عدّل النص من span، وعدّل الأيقونة من IconBox.xxx */}
              <div className="hero-badge">
                <i className={IconBox.iq} aria-hidden="true" />
                <span>Built for real performance — not guesses.</span>
              </div>

              <h1>Engineered to Build Real Ads.</h1>

              <p>
                We’re changing how advertising is built — from ideas to
                market-ready ads powered by real data, real structure, and real
                performance.
              </p>

              {/* ✅ CTA Buttons (تصميم فقط - الروابط لاحقًا) */}
              <div className="hero-actions">
                <button className="cta-btn" type="button">
                  Create a Market-Ready Ad
                </button>
                <button className="cta-btn" type="button">
                  Talk to Advertimus
                </button>
              </div>
            </div>

            {/* ===== Hero Image ===== */}
            {/* نوتس: الصورة من public */}
            <div className="hero-image">
              <div className="image-frame">
                <img src="/Adver-Header-Img.jpg" alt="Advertimus" />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Glow تحت الهيرو */}
        <div className="section-bottom-glow hero-glow" aria-hidden="true" />
      </section>

      {/* ===============================
        ✅ FEATURES SECTION
      =============================== */}
      <section className="features-section">
        <div className="container">
          <div className="section-head">
            <h2>Built to Solve Real Ad Problems</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-pill">
                <i className={IconBox.iq} aria-hidden="true" />
              </div>
              <h3>Advertimus iQ Is Coming</h3>
              <p>
                A next-generation ad system built to eliminate wasted spend and
                replace guesswork with precision-driven advertising power.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-pill">
                <i className={IconBox.design} aria-hidden="true" />
              </div>
              <h3>AI Ad Creation Engine</h3>
              <p>
                A single chat turns your idea into a complete, market-ready ad —
                no setups, no guesswork.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-pill">
                <i className={IconBox.proAd} aria-hidden="true" />
              </div>
              <h3>Engineered for Performance</h3>
              <p>
                Every element is built to win: copy, structure, creatives, and
                optimization logic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===============================
        ✅ FAQ SECTION
      =============================== */}
      <section className="faq-section">
        <div className="container faq-container">
          <div className="faq-head">
            <div className="faq-kicker">Got a question?</div>
            <h2>Advertimus Has the Answers</h2>
          </div>

          <div className="faq-list">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    className="faq-q"
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <i
                      className={`${IconBox.chevronDown} faq-arrow`}
                      aria-hidden="true"
                    />
                  </button>

                  <div className="faq-a" aria-hidden={!isOpen}>
                    <div className="faq-a-inner">{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ Glow تحت FAQ */}
        <div className="section-bottom-glow faq-glow" aria-hidden="true" />
      </section>

      {/* ===============================
        ✅ CSS
      =============================== */}
      <style jsx global>{`
        :root {
          --brand-red: #5d1a1b;
          --brand-blue: #161142;

          --bg: #000;
          --text: #fff;

          --muted: rgba(255, 255, 255, 0.75);
          --muted2: rgba(255, 255, 255, 0.60);

          /* نوتس: إذا بدك خط EXACT ابعث ملف الخط */
          --font-head: "Inter", "Manrope", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          --font-body: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;

          --card: rgba(255, 255, 255, 0.02);
          --radius: 18px;
        }

        * { box-sizing: border-box; }
        html, body { height: 100%; }
        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 2;
        }

        /* ===============================
          ✅ Shooting Stars (زدنا العدد + يمر من الوسط)
        =============================== */
        .shooting-stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .star {
          position: absolute;
          width: 170px;
          height: 2px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.38),
            rgba(255, 255, 255, 0)
          );
          border-radius: 999px;
          opacity: 0;
          filter: blur(0.5px);
          animation: shoot 12s linear infinite;
        }

        /* أماكن متنوعة (فيها الوسط بشكل واضح) */
        .s1  { top: 10%; left: -25%; transform: rotate(12deg);  animation-delay: 0.8s; }
        .s2  { top: 20%; left: -30%; transform: rotate(18deg);  animation-delay: 2.4s; }
        .s3  { top: 32%; left: -35%; transform: rotate(10deg);  animation-delay: 4.2s; } /* وسط */
        .s4  { top: 44%; left: -40%; transform: rotate(16deg);  animation-delay: 6.0s; } /* وسط */
        .s5  { top: 55%; left: -28%; transform: rotate(-10deg); animation-delay: 7.8s; } /* وسط */
        .s6  { top: 66%; left: -45%; transform: rotate(-14deg); animation-delay: 9.6s; }
        .s7  { top: 74%; left: -32%; transform: rotate(-8deg);  animation-delay: 11.4s; }
        .s8  { top: 28%; left: -50%; transform: rotate(22deg);  animation-delay: 13.2s; } /* وسط */
        .s9  { top: 48%; left: -55%; transform: rotate(14deg);  animation-delay: 15.0s; } /* وسط */
        .s10 { top: 62%; left: -60%; transform: rotate(-12deg); animation-delay: 16.8s; }
        .s11 { top: 38%; left: -65%; transform: rotate(20deg);  animation-delay: 18.6s; } /* وسط */
        .s12 { top: 52%; left: -70%; transform: rotate(-9deg);  animation-delay: 20.4s; } /* وسط */

        @keyframes shoot {
          0%   { opacity: 0; transform: translateX(0) translateY(0) rotate(14deg); }
          6%   { opacity: 0.9; }
          12%  { opacity: 0; }
          100% { opacity: 0; transform: translateX(190vw) translateY(-18vh) rotate(14deg); }
        }

        /* ===============================
          ✅ HERO
        =============================== */
        .hero-section {
          position: relative;
          padding: 84px 0 68px;
          overflow: hidden;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 54px;
          align-items: start;
        }

        .hero-text {
          padding-top: 6px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(93, 26, 27, 0.16);
          border: 1px solid rgba(93, 26, 27, 0.75);
          color: rgba(93, 26, 27, 0.95);
          box-shadow: 0 0 26px rgba(93, 26, 27, 0.10);
          user-select: none;
          margin-bottom: 22px;
          font-weight: 650;
          font-size: 14px;
        }

        .hero-badge i {
          font-size: 18px;
          color: rgba(93, 26, 27, 0.95);
          line-height: 1;
        }

        .hero-text h1 {
          margin: 0 0 18px;
          font-family: var(--font-head);
          font-weight: 900;
          letter-spacing: -0.03em;
          font-size: 56px;
          line-height: 1.04;
        }

        .hero-text p {
          margin: 0;
          max-width: 560px;
          font-size: 18px;
          line-height: 1.7;
          color: var(--muted);
        }

        .hero-actions {
          margin-top: 30px;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .cta-btn {
          position: relative;
          padding: 14px 22px;
          border-radius: 12px;
          background: transparent;
          color: var(--text);
          cursor: pointer;
          border: 1px solid transparent;
          background-image:
            linear-gradient(var(--bg), var(--bg)),
            linear-gradient(135deg, rgba(93, 26, 27, 0.75), rgba(22, 17, 66, 0.75));
          background-origin: border-box;
          background-clip: padding-box, border-box;
          transition: transform 0.18s ease, box-shadow 0.22s ease;
          overflow: hidden;
        }

        .cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 40px rgba(93, 26, 27, 0.15), 0 0 55px rgba(22, 17, 66, 0.15);
        }

        .cta-btn::after {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          background: conic-gradient(
            from 180deg,
            transparent 0deg,
            rgba(255, 255, 255, 0.18) 26deg,
            transparent 60deg,
            transparent 360deg
          );
          filter: blur(7px);
          opacity: 0.65;
          animation: edgeShine 4s linear infinite;
          pointer-events: none;

          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 2px;
        }

        @keyframes edgeShine {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .image-frame {
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--card);
          border: 1px solid rgba(22, 17, 66, 0.95);
          box-shadow: 0 0 55px rgba(22, 17, 66, 0.16), 0 0 55px rgba(93, 26, 27, 0.10);
        }

        .image-frame img {
          display: block;
          width: 100%;
          height: auto;
          transform: scale(1.01);
        }

        .section-bottom-glow {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: min(1100px, 92vw);
          height: 420px;
          filter: blur(70px);
          opacity: 0.95;
          z-index: 0;
        }

        .hero-glow {
          bottom: -230px;
          background: radial-gradient(
            ellipse at center,
            rgba(93, 26, 27, 0.38),
            rgba(22, 17, 66, 0.22),
            transparent 70%
          );
        }

        /* ===============================
          ✅ FEATURES
        =============================== */
        .features-section {
          position: relative;
          padding: 92px 0;
        }

        .section-head {
          text-align: center;
          margin-bottom: 44px;
        }

        .section-head h2 {
          margin: 0;
          font-family: var(--font-head);
          font-weight: 900;
          letter-spacing: -0.03em;
          font-size: 44px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .feature-card {
          background: var(--bg);
          border-radius: var(--radius);
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .icon-pill {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: rgba(93, 26, 27, 0.16);
          border: 1px solid rgba(93, 26, 27, 0.75);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 24px rgba(93, 26, 27, 0.10);
          margin-bottom: 16px;
        }

        .icon-pill i {
          font-size: 22px;
          color: rgba(93, 26, 27, 0.95);
        }

        .feature-card h3 {
          margin: 0 0 12px;
          font-family: var(--font-head);
          font-weight: 900;
          letter-spacing: -0.02em;
          font-size: 20px;
        }

        .feature-card p {
          margin: 0;
          color: var(--muted2);
          line-height: 1.7;
          font-size: 15.5px;
        }

        /* ===============================
          ✅ FAQ
        =============================== */
        .faq-section {
          position: relative;
          padding: 92px 0 120px;
          overflow: hidden;
        }

        .faq-container { max-width: 940px; }

        .faq-head {
          text-align: center;
          margin-bottom: 36px;
        }

        .faq-kicker {
          font-weight: 750;
          letter-spacing: 0.03em;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.62);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .faq-head h2 {
          margin: 0;
          font-family: var(--font-head);
          font-weight: 900;
          letter-spacing: -0.03em;
          font-size: 44px;
        }

        .faq-list {
          display: grid;
          gap: 14px;
        }

        .faq-item {
          border-radius: 16px;
          background: var(--bg);
          border: 1px solid rgba(255, 255, 255, 0.07);
          overflow: hidden;
          box-shadow:
            0 0 30px rgba(93, 26, 27, 0.03),
            0 0 30px rgba(22, 17, 66, 0.03);
        }

        .faq-q {
          width: 100%;
          border: 0;
          background: transparent;
          color: var(--text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 18px;
          font-family: var(--font-head);
          font-weight: 900;
          letter-spacing: -0.01em;
          font-size: 16px;
          text-align: left;
        }

        .faq-arrow {
          font-size: 20px;
          opacity: 0.9;
          transition: transform 0.22s ease;
        }

        .faq-item.open .faq-arrow {
          transform: rotate(180deg);
        }

        .faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.28s ease;
        }

        .faq-item.open .faq-a {
          max-height: 220px;
        }

        .faq-a-inner {
          padding: 0 18px 18px;
          color: var(--muted2);
          line-height: 1.75;
          font-size: 15px;
          font-family: var(--font-body);
        }

        .faq-glow {
          bottom: -230px;
          background: radial-gradient(
            ellipse at center,
            rgba(93, 26, 27, 0.34),
            rgba(22, 17, 66, 0.20),
            transparent 72%
          );
        }

        /* ===============================
          ✅ Responsive
        =============================== */
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .hero-text h1 { font-size: 46px; }

          .section-head h2,
          .faq-head h2 { font-size: 36px; }

          .features-grid { grid-template-columns: 1fr; }
        }

        /* ✅ تعديلات الموبايل المطلوبة */
        @media (max-width: 600px) {
          /* 1) العنوان والوصف بالنص */
          .hero-text {
            text-align: center;
            padding-top: 0;
          }

          .hero-text h1 { font-size: 36px; text-align: center; }

          .hero-text p {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
          }

          /* 2) تصغير البادج بالموبايل فقط */
          .hero-badge {
            font-size: 12px;
            padding: 8px 10px;
            gap: 8px;
            margin-left: auto;
            margin-right: auto;
            max-width: 92%;
            justify-content: center;
          }

          .hero-badge i { font-size: 16px; }

          /* 3) الأزرار مرتبة */
          .hero-actions {
            justify-content: center;
            gap: 12px;
          }

          .cta-btn {
            width: 100%;
            max-width: 360px;
          }

          .container { padding: 0 16px; }

          .section-head h2,
          .faq-head h2 { font-size: 30px; }
        }
      `}</style>
    </>
  );
}
