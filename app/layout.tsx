import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import "@/assets/styles/global.css";
import AuthWrapper from "@/components/AuthWrapper";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookit App | Book a Room",
  description: "Book a meeting or conference room for your team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthWrapper>
      <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <Header />
          <main className="w-full mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-grow">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </body>
      </html>
    </AuthWrapper>
  );
}
