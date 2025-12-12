import "./globals.css";
import "boxicons/css/boxicons.min.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "Advertimus",
  description: "Advertimus SaaS Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
