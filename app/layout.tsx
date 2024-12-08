import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LoginNavbar from "./components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Discount",
  description: "Get the best student discounts on your favorite brands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <LoginNavbar/>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
