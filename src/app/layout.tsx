import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "George Gagoshidze — Artist",
  description: "Georgian artist George Gagoshidze — paintings, portfolio, and works for sale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
