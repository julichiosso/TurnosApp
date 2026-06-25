import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const font = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Taller Manias - Reservá tu Turno",
  description: "Sistema de turnos online para Taller Manias SRL - Chapa y Pintura",
};

export const viewport: Viewport = {
  themeColor: "#CC0000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={font.className}>
      <body className="antialiased bg-[#0A0A0A] text-white">
        {children}
      </body>
    </html>
  );
}
