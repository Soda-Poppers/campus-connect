import Link from "next/link";
import { Calendar, MessageCircle } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { HydrateClient } from "~/trpc/server";
import HorizontalNamecard from "./_components/ProfileHorizontalCard";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

// Helper to get category styling
function getCategoryColor(category: string) {
  switch (category) {
    case "Project":
      return "border-blue-500 text-blue-600";
    case "Event":
      return "border-green-500 text-green-600";
    default:
      return "border-gray-300 text-gray-600";
  }
}

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await api.user.getUser({ id: session.user.id });
  if (!user) {
    redirect("/login");
  }

  // Hardcoded forum posts
  const recommendedPosts = [
    {
      id: "1",
      author: {
        name: "Alice Tan",
        year: "Year 2",
        telegram: "@alicetan",
        avatar: "/avatars/alice.png",
      },
      title: "Looking for teammates for Hackathon",
      description: "I'm looking for 2-3 people to join a weekend hackathon. Preferably with some frontend experience.",
      category: "Project",
      deadline: "2025-08-10",
      createdAt: "2 days ago",
    },
    {
      id: "2",
      author: {
        name: "Bryan Lim",
        year: "Year 1",
        telegram: "@bryanlim",
        avatar: "/avatars/bryan.png",
      },
      title: "Join us for our fundraising event!",
      description: "We’re organizing a charity fundraiser and need volunteers to help out with logistics and publicity.",
      category: "Event",
      deadline: "2025-08-20",
      createdAt: "1 day ago",
    },
  ];

  return (
    <HydrateClient>
      <main className="container mx-auto flex flex-col gap-2 pt-5 ">
        <span className="text-2xl font-bold text-primary text-left pl-6 mt-4">
          Welcome back!
        </span>
        <HorizontalNamecard user={user} />
        <div className="px-4 mt-2">
          {/* Recommended Quests */}
          <section className="space-y-4 ">
            <h2 className="text-xl font-semibold text-primary pl-2">Recommended Quests</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recommendedPosts.map((post) => (
                <Card key={post.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-primary">{post.author.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {post.author.year} • {post.createdAt}
                          </div>
                          <div className="text-sm text-muted-foreground">{post.author.telegram}</div>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                          post.category
                        )}`}
                      >
                        {post.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-medium text-primary mb-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-3">{post.description}</p>

                      {/* Deadline */}
                      {post.deadline && (
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          Deadline: {new Date(post.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end">
                      <Button className="bg-primary hover:bg-primary/90 text-white">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Link href="/forum">
                <Button variant="outline" className="text-primary hover:bg-muted">
                  See more quests
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
