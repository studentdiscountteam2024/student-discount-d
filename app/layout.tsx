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
      <head>
        {/* Google Analytics Script */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Q8ZKSDZEVL"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Q8ZKSDZEVL');
            `,
          }}
        ></script>
      </head>
      <body className={inter.className}>
        <LoginNavbar />
        {children}
      </body>
    </html>
  );
}