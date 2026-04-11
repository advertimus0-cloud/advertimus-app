import "./globals.css";
import "boxicons/css/boxicons.min.css";

export const metadata = {
  title: "Advertimus",
  description: "Advertimus SaaS Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
