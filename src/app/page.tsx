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
  // if (session?.user) {
  //   void api.post.getLatest.prefetch();
  // }
  let user;
  if (session?.user) {
    user = await api.user.getUserCard({ id: session.user.id });
  }

  return (
    <HydrateClient>
      <main className="container mx-auto flex min-h-screen px-4">
        <HorizontalNamecard user={user} />
      </main>
    </HydrateClient>
  );
}
