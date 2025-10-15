import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LA Residential - A Branch of Furr Construction - Family-Owned Home Builders",
  description: "Family-owned since 1991. We treat our clients like family with quality craftsmanship, honest communication, and exceptional service. Let our family serve yours.",
  keywords: ["home construction", "family-owned", "custom homes", "quality craftsmanship", "LA Residential - A Branch of Furr Construction", "Lauren Adam"],
  authors: [{ name: "LA Residential - A Branch of Furr Construction" }],
  openGraph: {
    title: "LA Residential - A Branch of Furr Construction - Family-Owned Home Builders",
    description: "Family-owned since 1991. We treat our clients like family with quality craftsmanship and exceptional service.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LA Residential - A Branch of Furr Construction - Family-Owned Home Builders",
    description: "Family-owned since 1991. We treat our clients like family with quality craftsmanship and exceptional service.",
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ConvexClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}