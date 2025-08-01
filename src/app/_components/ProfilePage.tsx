"use client";
import React, { useEffect } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import EditProfileModal from "../_components/editProfile";
import NamecardModal from "../_components/generateNameCard";
import type { Skill } from "~/types/skills";
import type { Project } from "~/types/projects";
import type { SocialMedia } from "~/types/socialMedia";
import toast from "react-hot-toast";
import {
  Edit3,
  MessageCircle,
  Instagram,
  Linkedin,
  Mail,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Copy,
} from "lucide-react";
import { useState } from "react";
import type { Course } from "@prisma/client";
import { api } from "~/trpc/react";
import type { Metadata } from "next";
import { AnimatePresence, motion } from "framer-motion";

interface FormData {
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

interface Module {
  id?: string;
  name: string;
  classId: string;
  prof: string;
}

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
const ProfilePage = () => {
  const utils = api.useUtils();
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNamecard, setShowNamecard] = useState(false);
  // Form state
  const [profile, setProfile] = useState<FormData>({
    name: "",
    enrollmentYear: 0,
    course: "COMPUTER_SCIENCE" as Course, // using enum value
    image: "",
    bannerURL: "",
    intro: "",
    hardSkills: [] as Skill[],
    softSkills: [] as Skill[],
    project: [] as Project[],
    interest: [] as Skill[],
    socialMedia: [] as SocialMedia[],
  });

  const [modules, setUserModules] = useState<Module[]>([]);

  const { data: userData } = api.user.getCurrentUser.useQuery();
  const { data: userModules } = api.module.getUserModules.useQuery();

  useEffect(() => {
    if (userData) {
      console.log(userData);
      setProfile({
        name: userData.name ?? "",
        enrollmentYear: userData.enrollmentYear ?? 1,
        course: userData.course ?? "COMPUTER_SCIENCE",
        image: userData.image ?? "",
        bannerURL: userData.bannerURL ?? "",
        intro: userData.intro ?? "",
        hardSkills: (userData.hardSkills as Skill[]) ?? [],
        softSkills: (userData.softSkills as Skill[]) ?? [],
        project: (userData.project as Project[]) ?? [],
        interest: (userData.interest as Skill[]) ?? [],
        socialMedia: (userData.socialMedia as SocialMedia[]) ?? [],
      });
    }
  }, [userData]);

  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (userModules) {
      setUserModules(
        userModules.map((module) => ({
          id: module.id,
          name: module.name,
          classId: module.classId,
          prof: module.prof,
        })),
      );
    }
    // name    String
    // classId String           @unique
    // prof    String
    // User    ModulesOnUsers[]
    // userId  String?
  }, [
    // name    String
    // classId String           @unique
    // prof    String
    // User    ModulesOnUsers[]
    // userId  String?
    userModules,
  ]);

  const onEditProfile = () => setShowEditProfile(true);
  const onShowNamecard = () => setShowNamecard(true);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "telegram":
        return <MessageCircle className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const { mutate: editUser } = api.user.editUser.useMutation({
    onSuccess: () => {
      toast.success("Profile updated!");
      void utils.user.invalidate();
    },
    onError: (e) => {
      console.error("Error:", e);
      toast.error("An error has occured");
    },
  });

  const handleProfileUpdate = (e: React.FormEvent, profileData: FormData) => {
    e.preventDefault();
    editUser(profileData);
  };
  // // Mock data if profile is empty
  // const profile = userProfile.name ? userProfile : {
  //     id: '1',
  //     name: 'Sarah Chen',
  //     email: 'sarah.chen.2023@smu.edu.sg',
  //     degree: 'Computer Science',
  //     year: 'Year 2',
  //     intro: 'Passionate about AI and machine learning!',
  //     profilePhoto: '',
  //     softSkills: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Creativity'],
  //     hardSkills: ['Python', 'React', 'Machine Learning', 'SQL', 'Git'],
  //     modules: [
  //         { id: 1, code: 'CS102', name: 'Data Structures and Algorithms', prof: 'Prof. Smith', classId: 'G1' },
  //         { id: 2, code: 'IS112', name: 'Data Management', prof: 'Prof. Johnson', classId: 'G2' },
  //         { id: 3, code: 'STAT101', name: 'Introduction to Statistics', prof: 'Prof. Wilson', classId: 'G3' }
  //     ],
  //     interests: ['AI/ML', 'Web Development', 'Data Science'],
  //     ccas: ['SMU Coding Club', 'Debate Society'],
  //     socials: {
  //         telegram: '@sarahchen',
  //         instagram: '@sarah_codes',
  //         linkedin: 'linkedin.com/in/sarah-chen',
  //         email: 'sarah.chen.2023@smu.edu.sg'
  //     }
  // };

  return (
    <div className="safe-area-top container-sm mx-auto h-full overflow-y-auto">
      {showEditProfile && (
        <div className="modal-overlay">
          <EditProfileModal
            open={showEditProfile}
            userProfile={profile}
            onSave={handleProfileUpdate}
            onClose={() => setShowEditProfile(false)}
          />
        </div>
      )}
      {showNamecard && (
        <div className="modal-overlay">
          <NamecardModal
            userMods={modules ?? []}
            userProfile={profile}
            onClose={() => setShowNamecard(false)}
          />
        </div>
      )}
      <div className="space-y-6 p-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <h1 className="text-primary text-xl font-bold">My Profile</h1>
          <div className="flex space-x-2">
            {/* <Button variant="outline" size="sm" onClick={onShowQR}>
                            <QrCode className="w-4 h-4" />
                        </Button> */}
            <Button
              variant="outline"
              className="flex-1"
              onClick={onShowNamecard}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Generate Namecard
            </Button>
            <Button variant="outline" size="sm" onClick={onEditProfile}>
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Profile Card - Singpass Style */}
        <Card className="border-primary/20 overflow-hidden border-2 p-0">
          {/* Header Section with Background */}
          <div className="from-primary to-secondary relative bg-gradient-to-r p-6 text-white">
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20 border-4 border-white">
                <AvatarImage src={profile.image} />
                <AvatarFallback className="text-primary bg-white text-xl font-bold">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-white/90">
                  {profile.course
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </p>
                <p className="text-sm text-white/80">
                  {profile.enrollmentYear}
                </p>
              </div>
            </div>

            {profile.intro && (
              <div className="mt-4 rounded-lg bg-white/10 p-3">
                <p className="text-sm">{profile.intro}</p>
              </div>
            )}
          </div>

          {/* Content Sections */}
          <div className="space-y-6 p-6">
            {/* Skills Section */}
            {(profile.softSkills.length > 0 ||
              profile.hardSkills.length > 0) && (
              <div>
                <h3 className="text-primary mb-3 font-medium">Skills</h3>

                {profile.softSkills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Soft Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.softSkills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-secondary text-secondary-foreground rounded-full border-0 px-3 py-1"
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
                )}

                {profile.hardSkills.length > 0 && (
                  <div>
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Hard Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.hardSkills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="default"
                          className="bg-primary text-primary-foreground rounded-full px-3 py-1"
                        >
                          {skill.skillName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="mt-4" />
              </div>
            )}

            {/* Modules Section */}
            {userModules && (
              <div>
                <h3 className="text-primary mb-3 font-medium">
                  Current Modules
                </h3>
                <div className="space-y-2">
                  {userModules.map((module) => (
                    <Card key={module.id} className="border-border/50 border">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="hover:bg-muted/50 w-full p-3 text-left transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{module.classId}</div>
                            {expandedModules[module.id] && (
                              <div className="mt-2 space-y-1">
                                {module.name && (
                                  <div className="text-muted-foreground text-sm">
                                    <span className="font-medium">Module:</span>{" "}
                                    {module.name}
                                  </div>
                                )}
                                {module.prof && (
                                  <div className="text-muted-foreground text-sm">
                                    <span className="font-medium">
                                      Professor:
                                    </span>{" "}
                                    {module.prof}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          {expandedModules[module.id] ? (
                            <ChevronUp className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <ChevronDown className="text-muted-foreground h-4 w-4" />
                          )}
                        </div>
                      </button>
                    </Card>
                  ))}
                </div>
                <Separator className="mt-4" />
              </div>
            )}

            {/* Interests */}
            {profile.interest.length > 0 && (
              <div>
                <h3 className="text-primary mb-3 font-medium">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interest.map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest.skillName}
                    </Badge>
                  ))}
                </div>
                <Separator className="mt-4" />
              </div>
            )}

            {/* Social Media Section */}
            <div>
              <h3 className="text-primary mb-3 font-medium">Connect</h3>
              <div className="grid grid-cols-2 gap-3">
                {profile.socialMedia.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto justify-start p-3"
                    onClick={() => {
                      // Handle social media link opening
                      console.log(
                        `Opening ${social.platform}: ${social.username}`,
                      );
                    }}
                  >
                    <div className="flex w-full items-center space-x-3">
                      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                        {getSocialIcon(social.platform)}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="text-muted-foreground text-xs capitalize">
                          {social.platform}
                        </div>
                        <div className="truncate text-sm font-medium">
                          {social.username}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-border/50 border-t p-4">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onShowNamecard}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Generate Namecard
              </Button>
              {/* <Button onClick={onShowQR} className="bg-primary">
                                <QrCode className="w-4 h-4 mr-2" />
                                Show QR Code
                            </Button> */}
            </div>

            {userData?.id && (
              <div
                className="relative mt-5 flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-500"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => {
                  setHovered(false);
                  setCopied(false);
                }}
                onClick={() => {
                  void navigator.clipboard.writeText(userData.id);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 500);
                }}
              >
                <span className="opacity-50">ID: {userData.id}</span>

                {/* Animate icon based on hover or copied state */}
                <AnimatePresence>
                  {(hovered || copied) && (
                    <motion.div
                      key={copied ? "check" : "copy"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="ml-1 text-gray-400"
                    >
                      {copied ? "Copied!" : <Copy size={16} />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </Card>

        {/* Bottom Spacing for Navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default ProfilePage;
