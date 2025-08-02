/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Course } from "@prisma/client"; // Import the Prisma-generated enum
import {
  ChevronDown,
  ChevronUp,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
} from "lucide-react";

const CourseDisplayNames: Record<Course, string> = {
  [Course.COMPUTER_SCIENCE]: "Computer Science",
  [Course.INFORMATION_SYSTEMS]: "Information Systems",
  [Course.ACCOUNTANCY]: "Accountancy",
  [Course.BUSINESS_MANAGEMENT]: "Business Management",
  [Course.ECONOMICS]: "Economics",
  [Course.COMPUTING_AND_LAW]: "Computing and Law",
  [Course.SOFTWARE_ENGINEERING]: "Software Engineering",
  [Course.LAW]: "Law",
  [Course.SOCIAL_SCIENCE]: "Social Science",
  [Course.INTEGRATIVE_STUDIES]: "Integrative Studies",
  [Course.SMU_DUKE_NUS_PATHWAY]: "SMU-Duke-NUS Pathway",
};

interface Skill {
  skillName: string;
}

interface InterestType {
  skillName: string;
}

interface SocialMedia {
  platform: string;
  username: string;
}

// Import the Prisma types
import type {
  User,
  Modules,
  ModulesOnUsers as PrismaModulesOnUsers,
} from "@prisma/client";
import { Button } from "~/components/ui/button";
import type { profile } from "console";

// Updated UserData type to match your Prisma schema and tRPC return
type UserData = User & {
  Modules: (PrismaModulesOnUsers & {
    module: Modules;
  })[];
};

interface Props {
  user: UserData;
}

const PortraitNamecard = ({ user }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract modules from the Modules relationship
  const modules =
    user.Modules?.map((moduleOnUser) => moduleOnUser.module) || [];

  // Helper function to safely parse JSON fields
  const parseJsonField = (field: any): any[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return typeof field === "string" ? JSON.parse(field) : field;
    } catch {
      return [];
    }
  };

  console.log("user?>>>>>>>", user);
  const softSkills = parseJsonField(user.softSkills);
  const hardSkills = parseJsonField(user.hardSkills);
  const socialMediaData = parseJsonField(user.socialMedia);
  const interests = user.interest as unknown as InterestType[];
  const projects = parseJsonField(user.project ?? []);

  const getAcademicYearLabel = (enrollmentYear?: number | string) => {
    if (!enrollmentYear) return "";
    const year =
      typeof enrollmentYear === "string"
        ? parseInt(enrollmentYear, 10)
        : enrollmentYear;
    if (isNaN(year)) return "";
    const currentYear = new Date().getFullYear();

    if (year > currentYear) {
      return `Pre-graduate (${year})`;
    }
    if (currentYear - year >= 6) {
      return `Alumni (${year})`;
    }
    const yearNumber = currentYear - year + 1;
    return `Y${yearNumber}`;
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

  const handleSocialMediaClick = (social: SocialMedia) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const profileUrl = `${baseUrl}/profile/${user.id}/view`;
    const message = `Find me, '${user.name}' on CampusConnect ${profileUrl}`;

    let url = "";

    switch (social.platform.toLowerCase()) {
      case "telegram":
        // For Telegram, we can open a chat with the user and pre-fill a message
        url = `https://t.me/${social.username.replace("@", "")}?text=${encodeURIComponent(message)}`;
        break;
      case "instagram":
        // Instagram doesn't support pre-filled messages, so just open the profile
        url = `https://instagram.com/${social.username.replace("@", "")}`;
        break;
      case "linkedin":
        // LinkedIn messaging with pre-filled text (this opens LinkedIn messaging if logged in)
        url = `https://www.linkedin.com/messaging/compose?recipient=${social.username}&body=${encodeURIComponent(message)}`;
        break;
      case "email":
        // Email with subject and body
        url = `mailto:${social.username}?subject=${encodeURIComponent(`Connect on CampusConnect`)}&body=${encodeURIComponent(message)}`;
        break;
      default:
        console.log(`Opening ${social.platform}: ${social.username}`);
        return;
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md min-w-xs overflow-hidden bg-white p-0 shadow-md transition-all duration-300">
      {/* Header with gradient */}
      <div className="from-primary to-secondary bg-gradient-to-r p-6 text-center text-white">
        {user.image && (
          <Avatar className="mx-auto mb-4 h-20 w-20 border-4 border-white">
            <AvatarImage src={user.image} />
            <AvatarFallback className="text-primary bg-white text-xl font-bold">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") ?? ""}
            </AvatarFallback>
          </Avatar>
        )}

        <h2 className="text-lg font-bold">{user.name}</h2>
        <p className="text-sm text-white/90">
          {user.enrollmentYear} •{" "}
          {user.enrollmentYear && (
            <span className="text-sm text-white/90">
              {getAcademicYearLabel(user.enrollmentYear)}
              <br />
              {user.course ? CourseDisplayNames[user.course] : "No Course"}
            </span>
          )}
          {!user.enrollmentYear && user.course && (
            <span>{CourseDisplayNames[user.course]}</span>
          )}
        </p>

        <p className="mt-1 text-sm text-white/80">
          {socialMediaData?.find((s: any) => s.platform === "telegram")
            ?.username ?? ""}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        {/* Skills - Always shown */}
        <div>
          <h3 className="text-primary mb-2 text-sm font-medium">Skills</h3>
          <div className="flex flex-wrap gap-1">
            {[
              ...softSkills.slice(0, isExpanded ? softSkills.length : 3),
              ...hardSkills.slice(0, isExpanded ? hardSkills.length : 3),
            ].map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-2 py-1 text-xs"
                style={{
                  backgroundColor:
                    index < (isExpanded ? softSkills.length : 3)
                      ? "#8a704d"
                      : "#151b4d",
                  color: "#ffffff",
                }}
              >
                {skill.skillName ?? skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Modules - Always shown but limited when minimized */}
        {modules.length > 0 && (
          <div>
            <h3 className="text-primary mb-2 text-sm font-medium">
              Current Modules
            </h3>
            <div className="space-y-1">
              {modules
                .slice(0, isExpanded ? modules.length : 3)
                .map((module) => (
                  <div
                    key={module.id}
                    className="text-muted-foreground text-xs"
                  >
                    {module.classId} - {module.name}
                  </div>
                ))}
              {!isExpanded && modules.length > 3 && (
                <div className="text-muted-foreground text-xs italic">
                  +{modules.length - 3} more modules
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <>
            {/* All Interests */}
            {interests && (
              <div>
                <h3 className="text-primary mb-2 text-sm font-medium">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-1">
                  {interests
                    .slice(0, isExpanded ? interests.length : 3)
                    .map((skill, index) => (
                      <Badge
                        key={index}
                        className="px-2 py-1 text-xs"
                        variant="outline"
                      >
                        {skill.skillName ?? skill}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h3 className="text-primary mb-2 text-sm font-medium">
                  Projects
                </h3>
                <div className="space-y-2">
                  {projects.map((project: any, index: number) => (
                    <div
                      key={index}
                      className="border-border/50 rounded border p-2"
                    >
                      <div className="text-sm font-medium">
                        {project.name ??
                          project.title ??
                          `Project ${index + 1}`}
                      </div>
                      {project.description && (
                        <div className="text-muted-foreground mt-1 text-xs">
                          {project.description}
                        </div>
                      )}
                      {project.technologies && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {project.technologies.map(
                            (tech: string, techIndex: number) => (
                              <Badge
                                key={techIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                {tech}
                              </Badge>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media */}
            {socialMediaData.length > 0 && (
              <div>
                <h3 className="text-primary mb-3 font-medium">Connect</h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialMediaData.map((social, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto justify-start p-3"
                      onClick={() => handleSocialMediaClick(social)}
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
            )}

            {/* Additional User Information */}
            <div>
              <h3 className="text-primary mb-2 text-sm font-medium">
                Profile Info
              </h3>
              <div className="text-muted-foreground space-y-1 text-xs">
                {user.email && (
                  <div>
                    <span className="font-medium">Email:</span> {user.email}
                  </div>
                )}
                {user.intro && (
                  <div>
                    <span className="font-medium">Bio:</span> {user.intro}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Minimized Interests - Only shown when minimized */}
        {!isExpanded && interests && (
          <div>
            <h3 className="text-primary mb-2 text-sm font-medium">Interests</h3>
            <div className="flex flex-wrap gap-1">
              {interests.map((skill, index) => (
                <Badge
                  key={index}
                  className="px-2 py-1 text-xs"
                  variant="outline"
                >
                  {skill.skillName ?? skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mx-auto mt-3 flex items-center justify-center rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
      >
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Footer */}
      <div className="border-border/50 border-t p-3 text-center">
        <p className="text-muted-foreground text-xs">
          Created by CampusConnect
        </p>
      </div>
    </Card>
  );
};

export default PortraitNamecard;
