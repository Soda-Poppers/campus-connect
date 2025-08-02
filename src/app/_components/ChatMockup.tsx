import React from "react";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import { api } from "~/trpc/react"; // Adjust import path as needed

interface Props {
  id: string;
}

const ChatMockup = ({ id }: Props) => {
  // Get user data using tRPC
  const { data: user } = api.user.getUser.useQuery({ id }); // Adjust the query name as needed

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const OGPreview = () => (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* OG Card Preview */}
      <Image
        alt="User OG Image"
        src={`https://campus-connect-nine-zeta.vercel.app/api/og/profile/${id}`}
        width={300}
        height={150}
        className="h-auto w-full"
      />
      {/* Link preview footer */}
      <div className="border-t bg-gray-50 px-3 py-2">
        <p className="truncate text-xs text-gray-600">
          campusconnect.smu.edu.sg/profile/{id}/view
        </p>
        <p className="mt-1 text-xs text-gray-500">CampusConnect Profile</p>
      </div>
    </div>
  );

  // Don't render until we have user data
  if (!user) {
    return (
      <div className="mx-auto max-w-sm space-y-3 rounded-lg bg-gray-100 p-3">
        <div className="text-center">
          <p className="text-xs text-gray-500">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-3 rounded-lg bg-gray-100 p-3">
      <div className="text-center">
        <h4 className="text-primary mb-1 text-xs font-medium">
          Preview: How it appears in chat
        </h4>
        <p className="text-muted-foreground text-xs">
          When you share your profile link
        </p>
      </div>

      {/* Chat Interface Mockup */}
      <div className="rounded-lg bg-white shadow-sm">
        {/* Chat Header */}
        <div className="flex items-center space-x-2 rounded-t-lg bg-blue-600 px-3 py-2 text-white">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-blue-500 text-xs text-white">
              📱
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Study Group Chat</span>
        </div>

        {/* Chat Messages */}
        <div className="min-h-[200px] space-y-3 bg-blue-50 p-3">
          {/* Other person's message */}
          <div className="flex items-start space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-gray-400 text-xs text-white">
                A
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="max-w-[200px] rounded-lg rounded-tl-none bg-white px-3 py-2 shadow-sm">
                <p className="text-sm">
                  Hey! Can you share your profile so we can see your skills for
                  the project?
                </p>
              </div>
              <p className="mt-1 ml-2 text-xs text-gray-500">
                {new Date(Date.now() - 120000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Your message with OG card */}
          <div className="flex items-end justify-end">
            <div className="max-w-[250px]">
              <div className="mb-2 rounded-lg rounded-br-none bg-blue-600 px-3 py-2 text-white shadow-sm">
                <p className="text-sm">
                  Find me, &apos;{user.name}&apos; on CampusConnect! You can
                  view my skills, projects and more!
                </p>
              </div>

              {/* OG Card Preview */}
              <div className="mb-1">
                <OGPreview />
              </div>

              <p className="text-right text-xs text-gray-500">{currentTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMockup;
