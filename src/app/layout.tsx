import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";
import { auth } from "~/server/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Campus Connect",
  description: "Connect, Collaborate, Create",
  icons: [{ rel: "icon", url: "/favicon.ico" }],

  openGraph: {
    title: "Campus Connect - Connect, Collaborate, Create.",
    description: "how your details easily and connect with others",
    url: "https://https://campus-connect-nine-zeta.vercel.app",
    siteName: "CORDY",
    images: [
      {
        url: "https://images.ctfassets.net/ayry21z1dzn2/18nEdfLsiM6rkC7ijR2YqE/d666c93fefe74d22059b024d69e4355a/WhatsApp_Image_2025-08-01_at_15.43.47.jpeg?h=250",
        width: 1200,
        height: 630,
        alt: "CampusConnect ",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Connect",
    description: "Connect with others.",
    images: [
      "https://images.ctfassets.net/ayry21z1dzn2/18nEdfLsiM6rkC7ijR2YqE/d666c93fefe74d22059b024d69e4355a/WhatsApp_Image_2025-08-01_at_15.43.47.jpeg?h=250",
    ],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="flex min-h-screen flex-col justify-between">
        <SessionProvider session={session}>
          <Toaster />
          <Navbar session={session} />
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
