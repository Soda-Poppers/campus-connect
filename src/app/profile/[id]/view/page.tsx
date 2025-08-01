/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PortraitNamecard from "~/app/_components/ProfileCard";
import type { User, Modules, ModulesOnUsers } from "@prisma/client";

type UserWithModules = User & {
  Modules: (ModulesOnUsers & {
    module: Modules;
  })[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  // Fetch user data in generateMetadata
  let user: UserWithModules | null = null;
  try {
    user = await api.user.getUserCard({ id: id });
  } catch (err: any) {
    // Return default metadata if user not found
    return {
      title: "User Profile Not Found",
      description: "The requested user profile could not be found.",
    };
  }

  if (!user) {
    return {
      title: "User Profile Not Found",
      description: "The requested user profile could not be found.",
    };
  }

  const title = `${user.name ?? "User"} - Campus Connect Profile`;
  const description =
    `View ${user.name ?? "this user"}'s profile on Campus Connect. ${user.course ? `Studying ${user.course}` : ""} ${user.enrollmentYear ? `since ${user.enrollmentYear}` : ""}`.trim();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "campus-connect-nine-zeta.vercel.app";
  const ogImageUrl = `${baseUrl}/api/og/profile/${id}`;
  const profileUrl = `${baseUrl}/profile/${id}/view`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: profileUrl,
      siteName: "Campus Connect",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${user.name ?? "User"}'s Profile Card`,
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    // Additional metadata
    robots: {
      index: true,
      follow: true,
    },
  };
}

const ProfilePublicView = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  let user: UserWithModules | null = null;
  try {
    user = await api.user.getUserCard({ id: id });
  } catch (err: any) {
    if (err?.data?.code === "NOT_FOUND") {
      console.log("User not found");
    }
    return notFound();
  }

  if (!user) {
    return <div>No user found.</div>;
  }

  return (
    <div
      className="h-full min-h-[90vh] px-4 py-8"
      style={{
        background: "linear-gradient(135deg, #151b4d 0%, #8a704d 100%)",
      }}
    >
      <div className="container mx-auto">
        <PortraitNamecard user={user} />
      </div>
    </div>
  );
};

export default ProfilePublicView;
