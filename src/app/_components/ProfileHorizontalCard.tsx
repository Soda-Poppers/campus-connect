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
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

// Updated UserData type to match your Prisma schema and tRPC return
type UserData = User & {
  Modules: (PrismaModulesOnUsers & {
    module: Modules;
  })[];
};

interface Props {
  user: UserData;
}

const HorizontalNamecard = ({ user }: Props) => {
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

  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const softSkills = parseJsonField(user.softSkills);
  const hardSkills = parseJsonField(user.hardSkills);
  const socialMediaData = parseJsonField(user.socialMedia);
  const interests = parseJsonField(user.interest) as InterestType[];
  const projects = parseJsonField(user.project ?? []);

  const getAcademicYearLabel = (enrollmentYear?: number | string) => {
    console.log("enrollmentYear>>", enrollmentYear);
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

  return (
    <div className="mx-auto my-5 w-full max-w-md px-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
      {/* Container with 4:3 aspect ratio (horizontal card) */}
      <div className="relative w-full" style={{ aspectRatio: "3/2" }}>
        <Card className="absolute inset-0 mx-auto flex flex-col gap-1 overflow-hidden !rounded-2xl bg-white p-0 shadow-lg">
          {/* Header with gradient - Fixed height proportion */}
          <div
            className="from-primary to-secondary flex flex-shrink-0 items-center bg-gradient-to-r p-3 px-6 text-white md:px-8"
            style={{ height: "45%" }}
          >
            {user.image && (
              <Avatar className="h-12 w-12 border-2 border-white sm:h-16 sm:w-16 md:h-20 md:w-20 md:border-4">
                <AvatarImage src={user.image} />
                <AvatarFallback className="text-primary bg-white text-sm font-bold sm:text-lg md:text-xl">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") ?? ""}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="ml-3 flex w-full flex-col items-start justify-center overflow-hidden sm:ml-4 md:ml-5">
              <h2 className="truncate text-sm font-bold sm:text-base md:text-lg">
                {user.name}
              </h2>
              <p className="text-left text-xs text-white/90 sm:text-sm">
                {user.enrollmentYear} •{" "}
                {user.enrollmentYear && (
                  <span className="text-xs text-white/90 sm:text-sm">
                    {getAcademicYearLabel(user.enrollmentYear)}
                    <br />
                    <span className="block truncate">
                      {user.course
                        ? CourseDisplayNames[user.course]
                        : "No Course"}
                    </span>
                  </span>
                )}
                {!user.enrollmentYear && user.course && (
                  <span className="truncate">
                    {CourseDisplayNames[user.course]}
                  </span>
                )}
              </p>

              <p className="mt-1 truncate text-xs text-white/80 sm:text-sm">
                {socialMediaData?.find((s: any) => s.platform === "telegram")
                  ?.username ?? ""}
              </p>
            </div>
          </div>

          {/* Content - Flexible height */}
          <div className="flex-1 overflow-hidden p-2 px-6 md:p-8">
            <div className="flex h-full space-x-4 sm:space-x-6">
              {/* Skills section */}
              <div className="min-w-0 flex-1">
                <h3 className="text-primary mb-1 text-xs font-medium sm:mb-2 sm:text-sm">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-1">
                  {[
                    ...softSkills.slice(0, isExpanded ? softSkills.length : 1),
                    ...hardSkills.slice(0, isExpanded ? hardSkills.length : 2),
                  ].map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-1.5 py-0.5 text-xs sm:px-2 sm:py-1"
                      style={{
                        backgroundColor:
                          index < (isExpanded ? softSkills.length : 3)
                            ? "#8a704d"
                            : "#151b4d",
                        color: "#ffffff",
                      }}
                    >
                      <span className="max-w-16 truncate sm:max-w-20">
                        {skill.skillName ?? skill}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Modules section */}
              {modules.length > 0 && (
                <div className="min-w-0 flex-1">
                  <h3 className="text-primary mb-1 text-xs font-medium sm:mb-2 sm:text-sm">
                    Current Modules
                  </h3>
                  <div
                    className={`space-y-1 ${isExpanded ? "max-h-full overflow-y-auto" : ""}`}
                  >
                    {modules
                      .slice(0, isExpanded ? modules.length : 2)
                      .map((module) => (
                        <div
                          key={module.id}
                          className="text-muted-foreground text-xs"
                        >
                          <span className="block truncate">
                            {module.classId} - {module.name}
                          </span>
                        </div>
                      ))}
                    {!isExpanded && modules.length > 2 && (
                      <div className="text-muted-foreground text-xs italic">
                        +{modules.length - 2} more modules
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HorizontalNamecard;
