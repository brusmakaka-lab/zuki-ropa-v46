import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Zuki Store | Boutique urbana premium",
    template: "%s | Zuki Store",
  },
  description: "Boutique online de ropa urbana premium, drops limitados y estilo sofisticado.",
  openGraph: {
    title: "Zuki Store",
    description: "Moda urbana premium con estetica boutique.",
    type: "website",
    images: [
      {
        url: "/brand/zuki-og.png",
        width: 1200,
        height: 630,
        alt: "Logo oficial Zuki Store",
      },
    ],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full antialiased">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster richColors position="top-center" />
        </CartProvider>
      </body>
    </html>
  );
}
