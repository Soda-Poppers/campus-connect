/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

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

  return {
    title: `User Profile - ${id}`,
    openGraph: {
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og/profile/${id}`,
          width: 1200,
          height: 630,
        },
      ],
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
