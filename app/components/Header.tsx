"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { IconBox } from "./IconBox";

type DropItem = { title: string; desc: string; icon: string };

export default function Header() {
  const [openMobile, setOpenMobile] = useState(false);
  const [activeDrop, setActiveDrop] = useState<"solutions" | "resources" | null>(null);
  const [activeNav, setActiveNav] = useState<"solutions" | "resources" | "pricing" | null>(null);

  const closeTimer = useRef<any>(null);

  const keepOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveDrop(null), 220);
  };

  const solutionsLeft: DropItem[] = useMemo(
    () => [
      { title: "Graphic Design Posts", desc: "High-end social posts & banners", icon: IconBox.design },
      { title: "Product Photo Shot", desc: "Studio-style product visuals", icon: IconBox.productShot },
      { title: "Fashion Photo Shot", desc: "Premium fashion product shots", icon: IconBox.fashionShot },
    ],
    []
  );

  const solutionsRight: DropItem[] = useMemo(
    () => [
      { title: "Full Professional Ad", desc: "Advanced ads, big budget, save time & money", icon: IconBox.proAd },
      { title: "Full Professional Fashion Ad", desc: "AI models, very realistic fashion ads", icon: IconBox.proFashion },
      { title: "Fashion Video Shot", desc: "Short cinematic fashion clips", icon: IconBox.fashionVideo },
      { title: "Product Video Shot", desc: "Short product showcase videos", icon: IconBox.productVideo },
    ],
    []
  );

  const resources: DropItem[] = useMemo(
    () => [
      { title: "Who is Advertimus", desc: "Meet the marketing superhero", icon: IconBox.who },
      { title: "Adver x Formula", desc: "Speed, precision, reaction", icon: IconBox.formula },
      { title: "Advertimus IQ System", desc: "Optimizes your ads campaigns 24/7", icon: IconBox.iq },
      { title: "Support", desc: "We’re here to help", icon: IconBox.support },
    ],
    []
  );

  return (
    <>
      <header className="adv-header">
        <div
          className="adv-header-shell"
          onMouseEnter={keepOpen}
          onMouseLeave={scheduleClose}
        >
          {/* Logo */}
          <div className="adv-logo">
            <Image
              src="/Advertimus-logo.png"
              alt="Advertimus Logo"
              width={160}
              height={52}
              priority
              className="adv-logo-img"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="adv-nav">
            <button
              className={`adv-nav-btn ${activeNav === "solutions" ? "is-active" : ""}`}
              onMouseEnter={() => {
                keepOpen();
                setActiveDrop("solutions");
              }}
              onClick={() => setActiveNav("solutions")}
              type="button"
            >
              Solutions <i className={IconBox.chevronDown} />
            </button>

            <button
              className={`adv-nav-btn ${activeNav === "resources" ? "is-active" : ""}`}
              onMouseEnter={() => {
                keepOpen();
                setActiveDrop("resources");
              }}
              onClick={() => setActiveNav("resources")}
              type="button"
            >
              Resources <i className={IconBox.chevronDown} />
            </button>

            <button
              className={`adv-nav-btn ${activeNav === "pricing" ? "is-active" : ""}`}
              onClick={() => setActiveNav("pricing")}
              type="button"
            >
              Pricing
            </button>
          </nav>

          {/* Actions */}
          <div className="adv-actions">
            <button className="adv-btn adv-btn-dark" type="button">
              Log in
            </button>
            <button className="adv-btn adv-btn-primary" type="button">
              Sign up
            </button>
          </div>

          {/* Mobile button */}
          <button className="adv-mobile-btn" onClick={() => setOpenMobile(true)} type="button">
            <i className={IconBox.menu} />
          </button>

          {/* Dropdowns */}
          {activeDrop === "solutions" && (
            <div className="adv-drop" onMouseEnter={keepOpen} onMouseLeave={scheduleClose}>
              <div className="adv-drop-inner">
                <div className="adv-drop-col">
                  <div className="adv-drop-title">ADVER POST LAB</div>
                  {solutionsLeft.map((it) => (
                    <DropRow key={it.title} item={it} />
                  ))}
                </div>

                <div className="adv-drop-col">
                  <div className="adv-drop-title">ADVER VIDEO LAB</div>
                  {solutionsRight.map((it) => (
                    <DropRow key={it.title} item={it} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeDrop === "resources" && (
            <div className="adv-drop" onMouseEnter={keepOpen} onMouseLeave={scheduleClose}>
              <div className="adv-drop-inner adv-drop-inner-single">
                <div className="adv-drop-col">
                  <div className="adv-drop-title">RESOURCES</div>
                  {resources.map((it) => (
                    <DropRow key={it.title} item={it} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {openMobile && (
        <div className="adv-m-overlay">
          <div className="adv-m-panel">
            <div className="adv-m-head">
              <Image
                src="/Advertimus-logo.png"
                alt="Advertimus Logo"
                width={140}
                height={44}
                className="adv-m-logo"
              />

              <button className="adv-m-close" onClick={() => setOpenMobile(false)} type="button">
                <i className={IconBox.close} />
              </button>
            </div>

            <div className="adv-m-actions">
              <button className="adv-btn adv-btn-dark adv-btn-full" type="button">Log in</button>
              <button className="adv-btn adv-btn-primary adv-btn-full" type="button">Sign up</button>
            </div>

            <div className="adv-m-sep" />

            <div className="adv-m-section">
              <div className="adv-m-h">SOLUTIONS</div>

              <div className="adv-m-sub">ADVER POST LAB</div>
              <MobileLink icon={IconBox.design} title="Graphic Design Posts" />
              <MobileLink icon={IconBox.productShot} title="Product Photo Shot" />
              <MobileLink icon={IconBox.fashionShot} title="Fashion Photo Shot" />

              <div className="adv-m-sub">ADVER VIDEO LAB</div>
              <MobileLink icon={IconBox.proAd} title="Full Professional Ad" />
              <MobileLink icon={IconBox.proFashion} title="Full Professional Fashion Ad" />
              <MobileLink icon={IconBox.fashionVideo} title="Fashion Video Shot" />
              <MobileLink icon={IconBox.productVideo} title="Product Video Shot" />
            </div>

            <div className="adv-m-sep" />

            <div className="adv-m-section">
              <div className="adv-m-h">RESOURCES</div>
              <MobileLink icon={IconBox.who} title="Who is Advertimus" />
              <MobileLink icon={IconBox.formula} title="Adver x Formula" />
              <MobileLink icon={IconBox.iq} title="Advertimus IQ System" />
              <MobileLink icon={IconBox.support} title="Support" />
            </div>

            <div className="adv-m-sep" />

            <div className="adv-m-section">
              <div className="adv-m-h">PRICING</div>
              <div className="adv-m-note">Pricing page link will be connected later.</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DropRow({ item }: { item: DropItem }) {
  return (
    <div className="adv-drop-row">
      <div className="adv-ic-box">
        <i className={item.icon} />
      </div>
      <div className="adv-drop-text">
        <div className="adv-drop-item-title">{item.title}</div>
        <div className="adv-drop-item-desc">{item.desc}</div>
      </div>
    </div>
  );
}

function MobileLink({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="adv-m-link">
      <div className="adv-ic-box adv-ic-box-sm">
        <i className={icon} />
      </div>
      <span>{title}</span>
    </div>
  );
}
