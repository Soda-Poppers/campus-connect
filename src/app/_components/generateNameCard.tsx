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

const NamecardModal = ({ userMods, userProfile, onClose }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Mock data if profile is empty
  const [profile, setProfile] = useState({
    ...userProfile,
  });
  const [modules, setModules] = useState({
    ...userMods,
  });

  const allSkills = [...profile.softSkills, ...profile.hardSkills];

  const toggleSkillSelection = (skill) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      } else if (prev.length < 3) {
        return [...prev, skill];
      }
      return prev;
    });
  };

  const handleDownload = (type) => {
    // Mock download functionality
    toast.success("Downloaded!");
  };

  const handleShare = async (type) => {
    const text = `Check out my ${type} on CampusConnect!`;
    const url = `https://campusconnect.smu.edu.sg/profile/${profile.id}`;

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
  }, []);

  const PortraitNamecard = () => (
    <Card className="from-primary/5 to-secondary/5 border-primary/20 mx-auto w-full max-w-xs overflow-hidden border-2 bg-slate-600 bg-gradient-to-br">
      {/* Header with gradient */}
      <div className="from-primary to-secondary bg-gradient-to-r p-6 text-center text-white">
        <Avatar className="mx-auto mb-4 h-20 w-20 border-4 border-white">
          <AvatarImage src={profile.profilePhoto} />
          <AvatarFallback className="text-primary bg-white text-xl font-bold">
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-bold">{profile.name}</h2>
        <p className="text-sm text-white/90">
          {profile.enrollmentYear} •{" "}
          {profile.course
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())}
        </p>
        <p className="mt-1 text-sm text-white/80">
          {profile.socialMedia?.find((s) => s.platform === "telegram")
            ?.username || ""}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        {/* Skills */}
        <div>
          <h3 className="text-primary mb-2 text-sm font-medium">Skills</h3>
          <div className="flex flex-wrap gap-1">
            {[
              ...profile.softSkills.slice(0, 3),
              ...profile.hardSkills.slice(0, 3),
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
            <h3 className="text-primary mb-2 text-sm font-medium">
              Current Modules
            </h3>
            <div className="space-y-1">
              {modules.slice(0, 3).map((module, index) => (
                <div key={index} className="text-muted-foreground text-xs">
                  {module.code} - {module.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {profile.interest?.length > 0 && (
          <div>
            <h3 className="text-primary mb-2 text-sm font-medium">Interests</h3>
            <div className="flex flex-wrap gap-1">
              {profile.interest
                .slice(0, 3)
                .map((interest: { skillName: string }, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {interest.skillName}
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-border/50 border-t p-3 text-center">
        <p className="text-muted-foreground text-xs">
          Created by CampusConnect
        </p>
      </div>
    </Card>
  );

  const OGCard = () => (
    <Card className="from-primary/5 to-secondary/5 border-primary/20 w-full overflow-hidden border-2 bg-gradient-to-r">
      <div className="flex items-center space-x-6 p-6">
        {/* Profile Info */}
        <div className="flex flex-1 items-center space-x-4">
          <Avatar className="border-primary/20 h-16 w-16 border-3">
            <AvatarImage src={profile.profilePhoto} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-primary font-bold">{profile.name}</h2>
            <p className="text-muted-foreground text-sm">
              {profile.enrollmentYear} • {profile.course}
            </p>
            <p className="text-muted-foreground text-sm">
              {profile.socialMedia?.find((s) => s.platform === "telegram")
                ?.username || ""}
            </p>

            {/* Selected Skills for OG Card */}
            <div className="mt-2 flex flex-wrap gap-1">
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
        <div className="text-right">
          <div className="bg-primary mb-2 flex h-12 w-12 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-sm font-bold">
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
      <DialogContent className="mx-auto flex h-[90vh] max-w-md flex-col bg-slate-900 p-0">
        <DialogHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <DialogTitle>Generate Namecard</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="sr-only">
            Generate and download personalized namecard or social sharing card
            from your profile
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="portrait" className="flex flex-1 flex-col">
          <TabsList className="mx-4 mt-4 grid w-full grid-cols-2">
            <TabsTrigger
              value="portrait"
              className="flex items-center space-x-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Portrait</span>
            </TabsTrigger>
            <TabsTrigger value="og" className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Social Card</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="portrait" className="space-y-4">
              <div className="text-center">
                <h3 className="text-primary mb-2 font-medium">
                  Portrait Namecard
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Perfect for saving and sharing your complete profile
                </p>
              </div>

              <div className="flex justify-center">
                <PortraitNamecard />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownload("portrait")}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={() => handleShare("portrait")}
                  className="bg-primary flex-1"
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="og" className="space-y-4">
              <div className="text-center">
                <h3 className="text-primary mb-2 font-medium">
                  Social Sharing Card
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Optimized for Telegram and social media sharing
                </p>
              </div>

              {/* Skill Selection for OG Card */}
              <div>
                <h4 className="text-primary mb-2 text-sm font-medium">
                  Select 3 skills to highlight ({selectedSkills.length}/3)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill, index) => {
                    const isSelected = selectedSkills.includes(skill.skillName);
                    return (
                      <Button
                        key={index}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSkillSelection(skill)}
                        className="text-xs"
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

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownload("og")}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={() => handleShare("og")}
                  className="bg-primary flex-1"
                >
                  <Share className="mr-2 h-4 w-4" />
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
