import "./globals.css";
import "boxicons/css/boxicons.min.css";
import { Plus_Jakarta_Sans } from 'next/font/google'

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
})

export const metadata = {
  title: "Advertimus",
  description: "Advertimus SaaS Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={displayFont.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
