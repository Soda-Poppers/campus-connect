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
} from "lucide-react";
import toast from "react-hot-toast";

interface Module {
  id?: string;
  name: string;
  prof?: string;
  classId?: string;
}

interface UserProfile {
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

  const handleShare = async (type: "portrait" | "og") => {
    const text = `Check out my ${type} on CampusConnect!`;
    const url = `https://campusconnect.smu.edu.sg/profile/${profile.name}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Profile - CampusConnect`,
          text: text,
          url: url,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      console.log("Copying link...");
    }
  };

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  const PortraitNamecard: React.FC = () => (
    <Card className="from-primary/5 to-secondary/5 border-primary/20 mx-auto w-full max-w-xs overflow-hidden border-2 bg-gradient-to-br">
      {/* Header with gradient */}
      <div className="from-primary to-secondary bg-gradient-to-r p-4 text-center text-white">
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
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h2 className="text-primary font-bold text-sm">{profile.name}</h2>
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
        <div className="text-right flex-shrink-0">
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="mx-auto flex h-[85vh] max-h-[600px] max-w-md flex-col p-0">
        <DialogHeader className="border-b p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base">Generate Namecard</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="sr-only">
            Generate and download personalized namecard or social sharing card
            from your profile
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="portrait" className="flex flex-1 flex-col min-h-0">
          <TabsList className="mx-3 mt-3 grid w-auto grid-cols-2 flex-shrink-0">
            <TabsTrigger
              value="portrait"
              className="flex items-center space-x-2 text-xs"
            >
              <CreditCard className="h-3 w-3" />
              <span>Portrait</span>
            </TabsTrigger>
            <TabsTrigger value="og" className="flex items-center space-x-2 text-xs">
              <ImageIcon className="h-3 w-3" />
              <span>Social Card</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-3 min-h-0">
            <TabsContent value="portrait" className="space-y-3 mt-0">
              <div className="text-center">
                <h3 className="text-primary mb-1 font-medium text-sm">
                  Portrait Namecard
                </h3>
                <p className="text-muted-foreground mb-3 text-xs">
                  Perfect for saving and sharing your complete profile
                </p>
              </div>

              <div className="flex justify-center">
                <PortraitNamecard />
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload("portrait")}
                  className="flex-1 text-xs h-8"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
                <Button
                  onClick={() => handleShare("portrait")}
                  className="bg-primary flex-1 text-xs h-8"
                >
                  <Share className="mr-1 h-3 w-3" />
                  Share
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="og" className="space-y-3 mt-0">
              <div className="text-center">
                <h3 className="text-primary mb-1 font-medium text-sm">
                  Social Sharing Card
                </h3>
                <p className="text-muted-foreground mb-3 text-xs">
                  Optimized for Telegram and social media sharing
                </p>
              </div>

              {/* Skill Selection for OG Card */}
              <div>
                <h4 className="text-primary mb-2 text-xs font-medium">
                  Select 3 skills to highlight ({selectedSkills.length}/3)
                </h4>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {allSkills.map((skill, index) => {
                    const isSelected = selectedSkills.some(
                      (selectedSkill) =>
                        selectedSkill.skillName === skill.skillName,
                    );
                    return (
                      <Button
                        key={index}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSkillSelection(skill)}
                        className="text-xs h-6 px-2"
                        disabled={!isSelected && selectedSkills.length >= 3}
                      >
                        {skill.skillName}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center">
                <OGCard />
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload("og")}
                  className="flex-1 text-xs h-8"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
                <Button
                  onClick={() => handleShare("og")}
                  className="bg-primary flex-1 text-xs h-8"
                >
                  <Share className="mr-1 h-3 w-3" />
                  Share
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NamecardModal;