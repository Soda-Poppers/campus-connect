import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { Skill } from "~/types/skills";
import type { Project } from "~/types/projects";
import type { SocialMedia } from "~/types/socialMedia";
import type { Course } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Download,
  Share,
  X,
  CreditCard,
  Image as ImageIcon,
  MessageCircle,
  Send,
  Copy,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import ChatMockup from "./ChatMockup";
import Link from "next/link";

interface Module {
  id?: string;
  name: string;
  prof?: string;
  classId?: string;
}

interface UserProfile {
  id: string;
  name: string;
  enrollmentYear: number;
  intro: string;
  image: string;
  bannerURL: string;
  course: Course;
  project: Project[];
  interest: Skill[];
  hardSkills: Skill[];
  softSkills: Skill[];
  socialMedia: SocialMedia[];
}

interface NamecardModalProps {
  userMods: Module[];
  userProfile: UserProfile;
  onClose: () => void;
}

const NamecardModal: React.FC<NamecardModalProps> = ({
  userMods,
  userProfile,
  onClose,
}) => {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  // Mock data if profile is empty
  const [profile] = useState<UserProfile>({
    ...userProfile,
  });
  const [modules] = useState<Module[]>([...userMods]);

  const allSkills: Skill[] = [
    ...(profile.softSkills ?? []),
    ...(profile.hardSkills ?? []),
  ];

  const toggleSkillSelection = (skill: Skill) => {
    setSelectedSkills((prev) => {
      if (prev.some((s) => s.skillName === skill.skillName)) {
        return prev.filter((s) => s.skillName !== skill.skillName);
      } else if (prev.length < 3) {
        return [...prev, skill];
      }
      return prev;
    });
  };

  const handleDownload = (type: "portrait" | "og") => {
    // Mock download functionality
    toast.success("Download function coming soon!");
  };

  // Platform-specific sharing functions
  const shareToTelegram = (type: "portrait" | "og") => {
    const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${profile.id}/view`;
    const message =
      type === "portrait"
        ? `🎓 Check out my CampusConnect profile! Find me, '${profile.name}' on CampusConnect`
        : `👋 Find me, '${profile.name}' on CampusConnect`;

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, "_blank");
  };

  const shareToWhatsApp = (type: "portrait" | "og") => {
    const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${profile.id}/view`;
    const message =
      type === "portrait"
        ? `🎓 Hey! Check out my CampusConnect profile - Find me, '${profile.name}' on CampusConnect\n${profileUrl}`
        : `👋 Find me, '${profile.name}' on CampusConnect\n${profileUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareToDiscord = (type: "portrait" | "og") => {
    const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${profile.id}/view`;
    const message =
      type === "portrait"
        ? `🎓 Check out my CampusConnect profile! Find me, '${profile.name}' on CampusConnect ${profileUrl}`
        : `👋 Find me, '${profile.name}' on CampusConnect ${profileUrl}`;

    // Copy to clipboard for Discord (Discord doesn't have direct sharing URL)
    navigator.clipboard
      .writeText(message)
      .then(() => {
        toast.success("Message copied! Paste it in Discord");
      })
      .catch(() => {
        toast.error("Failed to copy message");
      });
  };

  const copyLink = (type: "portrait" | "og") => {
    const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${profile.id}/view`;
    const message =
      type === "portrait"
        ? `Find me, '${profile.name}' on CampusConnect ${profileUrl}`
        : `Find me, '${profile.name}' on CampusConnect ${profileUrl}`;

    navigator.clipboard
      .writeText(message)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  // Copy link function for portrait tab
  const copyPortraitLink = () => {
    const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${profile.id}/view`;

    navigator.clipboard
      .writeText(profileUrl)
      .then(() => {
        toast.success("Profile link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  const PortraitNamecard: React.FC = () => (
    <Card className="from-primary/5 to-secondary/5 border-primary/20 mx-auto w-full max-w-xs overflow-hidden border-2 bg-gradient-to-br p-0">
      {/* Header with gradient */}
      <div className="from-primary to-secondary bg-gradient-to-r p-4 py-7 text-center text-white">
        <Avatar className="mx-auto mb-3 h-16 w-16 border-4 border-white">
          <AvatarImage src={profile.image} />
          <AvatarFallback className="text-primary bg-white text-lg font-bold">
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-base font-bold">{profile.name}</h2>
        <p className="text-xs text-white/90">
          {profile.enrollmentYear} •{" "}
          {profile.course
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())}
        </p>
        <p className="mt-1 text-xs text-white/80">
          {profile.socialMedia?.find((s) => s.platform === "telegram")
            ?.username ?? ""}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Skills */}
        <div>
          <h3 className="text-primary mb-2 text-xs font-medium">Skills</h3>
          <div className="flex flex-wrap gap-1">
            {[
              ...(profile.softSkills ?? []).slice(0, 3),
              ...(profile.hardSkills ?? []).slice(0, 3),
            ].map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-2 py-1 text-xs"
                style={{
                  backgroundColor: index < 3 ? "#8a704d" : "#151b4d",
                  color: "#ffffff",
                }}
              >
                {skill.skillName}
              </Badge>
            ))}
          </div>
        </div>

        {/* Modules */}
        {modules.length > 0 && (
          <div>
            <h3 className="text-primary mb-2 text-xs font-medium">
              Current Modules
            </h3>
            <div className="space-y-1">
              {modules.slice(0, 2).map((module, index) => (
                <div key={index} className="text-muted-foreground text-xs">
                  {module.classId} - {module.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {profile.interest && profile.interest.length > 0 && (
          <div>
            <h3 className="text-primary mb-2 text-xs font-medium">Interests</h3>
            <div className="flex flex-wrap gap-1">
              {profile.interest
                .slice(0, 3)
                .map((interest: Skill, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {interest.skillName}
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-border/50 border-t p-2 text-center">
        <p className="text-muted-foreground text-xs">
          Created by CampusConnect
        </p>
      </div>
    </Card>
  );

  const OGCard = () => (
    <Card className="from-primary/5 to-secondary/5 border-primary/20 w-full overflow-hidden border-2 bg-gradient-to-r">
      <div className="flex items-center space-x-4 p-4">
        {/* Profile Info */}
        <div className="flex flex-1 items-center space-x-3">
          <Avatar className="border-primary/20 h-12 w-12 border-2">
            <AvatarImage src={profile.image} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h2 className="text-primary text-sm font-bold">{profile.name}</h2>
            <p className="text-muted-foreground text-xs">
              {profile.enrollmentYear} • {profile.course}
            </p>
            <p className="text-muted-foreground text-xs">
              {profile.socialMedia?.find((s) => s.platform === "telegram")
                ?.username ?? ""}
            </p>

            {/* Selected Skills for OG Card */}
            <div className="mt-1 flex flex-wrap gap-1">
              {(selectedSkills.length > 0
                ? selectedSkills
                : allSkills.slice(0, 3)
              ).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: "#8a704d",
                    color: "#ffffff",
                  }}
                >
                  {skill.skillName}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* CampusConnect Logo/Branding */}
        <div className="flex-shrink-0 text-right">
          <div className="bg-primary mb-1 flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-xs font-bold">
              CC
            </span>
          </div>
          <p className="text-muted-foreground text-xs">CampusConnect</p>
        </div>
      </div>
    </Card>
  );

  // Sharing buttons component
  const SharingButtons = ({ type }: { type: "portrait" | "og" }) => (
    <div className="space-y-2">
      <p className="text-muted-foreground mb-3 text-center text-xs">
        Share your profile on:
      </p>

      {/* Primary sharing buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => shareToTelegram(type)}
          className="h-9 bg-[#0088cc] text-xs text-white hover:bg-[#0077bb]"
        >
          <Send className="mr-2 h-3 w-3" />
          Telegram
        </Button>
        <Button
          onClick={() => shareToWhatsApp(type)}
          className="h-9 bg-[#25D366] text-xs text-white hover:bg-[#22c55e]"
        >
          <MessageCircle className="mr-2 h-3 w-3" />
          WhatsApp
        </Button>
      </div>

      {/* Secondary sharing buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={() => shareToDiscord(type)}
          className="h-9 border-[#5865F2] text-xs text-[#5865F2] hover:bg-[#5865F2] hover:text-white"
        >
          <MessageCircle className="mr-2 h-3 w-3" />
          Discord
        </Button>
        <Button
          variant="outline"
          onClick={() => copyLink(type)}
          className="h-9 text-xs"
        >
          <Share className="mr-2 h-3 w-3" />
          Copy Link
        </Button>
      </div>

      {/* Download option */}
      <Button
        variant="ghost"
        onClick={() => handleDownload(type)}
        className="text-muted-foreground h-8 w-full text-xs"
      >
        <Download className="mr-2 h-3 w-3" />
        Download Image (Coming Soon)
      </Button>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="mx-auto flex h-[90vh] max-h-[700px] max-w-md flex-col p-0">
        <DialogHeader className="flex-shrink-0 border-b p-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base">Generate Namecard</DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Generate and download personalized namecard or social sharing card
            from your profile
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="portrait" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="mx-3 grid w-auto flex-shrink-0 grid-cols-2">
            <TabsTrigger
              value="portrait"
              className="flex items-center space-x-2 text-xs"
            >
              <CreditCard className="h-3 w-3" />
              <span>Portrait</span>
            </TabsTrigger>
            <TabsTrigger
              value="og"
              className="flex items-center space-x-2 text-xs"
            >
              <ImageIcon className="h-3 w-3" />
              <span>Social Card</span>
            </TabsTrigger>
          </TabsList>

          <div className="min-h-0 flex-1 overflow-y-auto p-3 px-4">
            <TabsContent value="portrait" className="mt-0 space-y-3">
              <div className="text-center">
                <h3 className="text-primary mb-1 text-sm font-medium">
                  Portrait Namecard
                </h3>
                <p className="text-muted-foreground mb-3 text-xs">
                  Perfect for saving and sharing your complete profile
                </p>
              </div>

              <div className="flex justify-center">
                <PortraitNamecard />
              </div>

              <div className="flex w-full gap-4">
                <Button
                  variant="outline"
                  onClick={copyPortraitLink}
                  className="h-9 flex-1 text-xs"
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Link
                </Button>
                <Link
                  href={`/profile/${userProfile.id}/view`}
                  className="flex-1"
                >
                  <Button className="bg-primary hover:bg-primary/90 h-9 w-full text-xs text-white">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    View Card
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="og" className="mt-0 space-y-3">
              <div className="text-center">
                <h3 className="text-primary mb-1 text-sm font-medium">
                  Social Sharing Card
                </h3>
                <p className="text-muted-foreground mb-3 text-xs">
                  Optimized for Telegram and social media sharing
                </p>
              </div>

              <ChatMockup id={userProfile.id} />

              <SharingButtons type="og" />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NamecardModal;
