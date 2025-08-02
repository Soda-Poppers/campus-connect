import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import HorizontalNamecard from "./_components/ProfileHorizontalCard";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  let user;
  if (session?.user) {
    user = await api.user.getUser({ id: session.user.id });
  }
  if (!user) {
    redirect("/login"); // or wherever you want to redirect for profile setup
  }

  if (!user) {
    redirect("login");
  }

  return (
    <HydrateClient>
      <main className="container mx-auto flex min-h-screen">
        <HorizontalNamecard user={user} />
      </main>
    </HydrateClient>
  );
}
