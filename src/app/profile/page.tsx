import React, { useEffect } from "react";

import type { Metadata } from "next";
import ProfilePage from "../_components/ProfilePage";

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
  return <ProfilePage />;
};

export default Page;
