import type { Metadata } from "next";
import "./globals.css";
import "./styles/app.css";
import "./styles/panels.css";
import "./styles/wizard.css";

export const metadata: Metadata = {
  title: "Social Orbit — İlişkilerinin Çekim Alanı",
  description: "Hayatındaki insanları duygusal yakınlıklarına göre kendi 3D evreninde konumlandır.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Social Orbit",
    description: "Yakınlık bir çekim meselesi.",
    images: ["/social-orbit-og.png"],
  },
  twitter: { card: "summary_large_image", images: ["/social-orbit-og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
