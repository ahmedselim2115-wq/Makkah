import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makkahrefrigerators.com"),
  title: {
    default: "مصنع مكة للثلاجات | ثلاجات تجارية وصناعية بالقاهرة",
    template: "%s | مصنع مكة للثلاجات",
  },
  description: "مصنع مكة للثلاجات - متخصصون في تصنيع الثلاجات التجارية والصناعية وغرف التبريد بأحدث التقنيات وأعلى معايير الجودة في مصر.",
  keywords: [
    "مصنع مكة للثلاجات",
    "ثلاجات تجارية",
    "ثلاجات عرض",
    "ثلاجات صناعية",
    "غرف تبريد",
    "ثلاجات لحوم",
    "تبريد القاهرة",
    "ثلاجات مصر",
  ],
  authors: [{ name: "مصنع مكة للثلاجات" }],
  icons: {
    icon: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://makkahrefrigerators.com",
  },
  openGraph: {
    title: "مصنع مكة للثلاجات",
    description: "حلول تبريد متكاملة - ثلاجات تجارية وصناعية بأحدث التقنيات",
    url: "https://makkahrefrigerators.com",
    siteName: "مصنع مكة للثلاجات",
    images: ["/logo.png"],
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "مصنع مكة للثلاجات",
    description: "حلول تبريد متكاملة - ثلاجات تجارية وصناعية بأحدث التقنيات",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${tajawal.variable} antialiased bg-background text-foreground font-tajawal`}
      >
        <LanguageProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}