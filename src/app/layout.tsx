import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edufio · Penjadwalan Sesi Les",
  description: "Jadwalkan sesi les privat Edufio langkah demi langkah.",
  icons: {
    icon: 'Edufio.png',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#026c7a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-ink font-sans">
        <div className="mx-auto flex w-full flex-1 flex-col bg-bg lg:max-w-7xl">
          {children}
        </div>
      </body>
    </html>
  );
}
