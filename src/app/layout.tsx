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
  title: "مصنع مكة للثلاجات |  التبريد الحديثة",
  description: "مصنع مكة للثلاجات - متخصصون في تصنيع الثلاجات التجارية والصناعية والمجوهرات التبريدية بأحدث التقنيات وأعلى معايير الجودة.",
  keywords: ["مصنع مكة", "ثلاجات", "ثلاجات تجارية", "ثلاجات صناعية", "تبريد", "مكة"],
  authors: [{ name: "مصنع مكة للثلاجات" }],
  openGraph: {
    title: "مصنع مكة للثلاجات",
    description: " التبريد الحديثة - حلول تبريد متكاملة",
    type: "website",
    locale: "ar_SA",
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