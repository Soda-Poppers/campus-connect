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
