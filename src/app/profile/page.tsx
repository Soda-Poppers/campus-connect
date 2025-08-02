import React from "react";

import type { Metadata } from "next";
import ProfilePage from "../_components/ProfilePage";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View your profile and namecard.",
  keywords: "opportunity, user, profile, details",
  openGraph: {
    title: "User Profile",
    description: "View users profile",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile`,
  },
  twitter: {
    card: "summary_large_image",
    title: "User Profile",
    description: "View user profile.",
  },
};

// const ProfilePage = ({ userProfile, onShowQR, onEditProfile, onShowNamecard }) => {
const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  } else {
    const userCheck = await api.user.didUserFinishWelcome();
    console.log(">>>>>> HITTT");
    if (!userCheck?.enrollmentYear) {
      redirect("/new-user");
    }
  }

  return (
    <div className="container-sm mx-auto">
      <ProfilePage />
    </div>
  );
};

export default Page;
