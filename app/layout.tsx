// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  // NOTE: غيّر عنوان التاب من هون
  title: "Advertimus – Experimental Landing",
  // NOTE: غيّر وصف الموقع من هون
  description: "Test landing page for Advertimus on Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* NOTE: هنا رابطنا Boxicons مرّة واحدة للمشروع كله */}
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        />
      </head>

      <body className="site-body">
        <div className="site-wrapper">
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
