import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MallScreen · Diffusez sur l'écran géant du Morocco Mall",
  description: "Réservez votre diffusion sur l'écran géant du Morocco Mall à Casablanca. Téléchargez votre contenu, visualisez l'aperçu en temps réel et payez en ligne.",
  keywords: "écran géant, Morocco Mall, publicité, diffusion, Casablanca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
