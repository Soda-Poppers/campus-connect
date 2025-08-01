/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { User } from "@prisma/client";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";
import type { Skill } from "~/types/skills";

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

// Helper function to validate image URL
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && 
           (url.includes('cloudinary.com') || 
            url.includes('amazonaws.com') || 
            url.includes('googleapis.com') ||
            url.includes('github.com') ||
            url.includes('gravatar.com') ||
            url.includes('vercel.com'));
  } catch {
    return false;
  }
};

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    
    console.log('OG: Processing user ID:', userId);
    
    // Fetch user data
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/internal/user?id=${userId}`,
      {
        headers: {
          'User-Agent': 'NextJS-OG-Generator',
        },
      }
    );
    
    console.log('OG: Response status:', userResponse.status);
    
    if (!userResponse.ok) {
      console.log('OG: User fetch failed');
      return new ImageResponse(
        React.createElement(
          'div',
          {
            style: {
              fontSize: 48,
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              textAlign: "center",
            }
          },
          React.createElement('div', { 
            style: { fontSize: 64, marginBottom: 20 } 
          }, '❌'),
          React.createElement('h1', { 
            style: { margin: 0, fontSize: 48 } 
          }, 'User Not Found'),
          React.createElement('p', { 
            style: { margin: "10px 0 0 0", fontSize: 24, opacity: 0.9 } 
          }, 'The requested profile could not be loaded')
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    const user = await userResponse.json();
    console.log('OG: User data received:', !!user?.name);
  
    if (!user?.name) {
      console.log('OG: No user name found');
      return new ImageResponse(
        React.createElement(
          'div',
          {
            style: {
              fontSize: 48,
              background: "linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              textAlign: "center",
            }
          },
          React.createElement('div', { 
            style: { fontSize: 64, marginBottom: 20 } 
          }, '⚠️'),
          React.createElement('h1', { 
            style: { margin: 0, fontSize: 48 } 
          }, 'Profile Incomplete'),
          React.createElement('p', { 
            style: { margin: "10px 0 0 0", fontSize: 24, opacity: 0.9 } 
          }, 'User profile data is not available')
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    console.log('OG: Generating image for:', user.name);

    // Extract user data with fallbacks
    const userName = user.name ?? 'Unknown User';
    const userCourse = user.course ? 
      user.course.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase()) : 
      'Computer Science';
    const userYear = getAcademicYearLabel(user.enrollmentYear)
    const userIntro = user.intro ?? 'Passionate student ready to connect and collaborate!';
    const rawUserImage = user.image ?? '';
    
    // Validate image URL
    const userImage = isValidImageUrl(rawUserImage) ? rawUserImage : '';
    console.log('OG: Image URL:', rawUserImage);
    console.log('OG: Image URL valid:', !!userImage);
    
    type MaybeSkill = Skill | string | undefined;
    const getTopSkills = (user: any, limit = 3): MaybeSkill[] => {
      const hard: MaybeSkill[] = Array.isArray(user.hardSkills) ? user.hardSkills.slice(0, limit) : [];
      const soft: MaybeSkill[] = Array.isArray(user.softSkills)
        ? user.softSkills.slice(0, Math.max(0, limit - hard.length))
        : [];
      const combined = [...hard, ...soft].slice(0, limit);
      
      console.log('OG: Hard skills:', hard);
      console.log('OG: Soft skills:', soft);
      console.log('OG: Combined skills:', combined);
      
      return combined;
    };

    const allSkills = getTopSkills(user);
    
    // Extract social media - find telegram
    const socialMedia = user.socialMedia ?? [];
    const telegramAccount = socialMedia.find((s: any) => s.platform === 'telegram');
    const telegramHandle = telegramAccount?.username ?? '';

    // Generate initials for fallback avatar
    const initials = userName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    // Main namecard-style profile image
    return new ImageResponse(
      React.createElement(
        'div',
        {
          style: {
            width: "1200px",
            height: "630px",
            display: "flex",
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            background: "#ffffff",
          }
        },
        
        // Dark blue section
        React.createElement(
          'div',
          {
            style: {
              width: "260px",
              height: "630px",
              background: "#151b4d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }
          },
          
          // Profile photo or avatar - MOVED INSIDE BLUE SECTION
          userImage ? 
            React.createElement('img', {
              src: userImage,
              alt: userName,
              style: {
                width: "200px",
                height: "200px",
                borderRadius: "100px",
                border: "6px solid white",
                objectFit: "cover",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }
            }) :
            React.createElement(
              'div',
              {
                style: {
                  width: "200px",
                  height: "200px",
                  borderRadius: "100px",
                  border: "6px solid white",
                  background: "linear-gradient(135deg, #a78058 0%, #8a6f47 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "80px",
                  fontWeight: "bold",
                  color: "white",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                }
              },
              initials
            )
        ),
        
        // Gold border
        React.createElement('div', {
          style: {
            width: "32px",
            height: "630px",
            background: "#8a704d",
          }
        }),
        
        // White section content
        React.createElement(
          'div',
          {
            style: {
              width: "908px",
              height: "630px",
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "60px",
            }
          },
          
          // Name and social handle
          React.createElement(
            'div',
            {
              style: {
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "16px",
              }
            },
            React.createElement('h1', { 
              style: { 
                fontSize: "56px", 
                margin: 0,
                fontWeight: "900",
                lineHeight: 1.1,
                color: "#1e293b",
              } 
            }, userName),
            telegramHandle ? React.createElement(
              'div',
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  fontSize: "22px",
                  color: "#0ea5e9",
                  fontWeight: "600",
                  background: "#e0f2fe",
                  padding: "8px 16px",
                  borderRadius: "24px",
                }
              },
              React.createElement('div', {
                style: {
                  marginRight: "8px",
                  fontSize: "18px",
                }
              }, '📱'),
              `@${telegramHandle}`
            ) : null
          ),
          
          // Course and year
          React.createElement('p', { 
            style: { 
              fontSize: "30px", 
              margin: "0 0 24px 0",
              color: "#475569",
              fontWeight: "600",
            } 
          }, `SMU ${userCourse} ${userYear}`),
          
          // Skills
          allSkills.length > 0
            ? React.createElement(
                'div',
                {
                  style: {
                    display: "flex",
                    gap: "12px",
                    marginBottom: "32px",
                    flexWrap: "wrap",
                  },
                },
                ...allSkills.map((skill: MaybeSkill, index: number) => {
                  let skillName: string;
                  
                  if (typeof skill === "string") {
                    skillName = skill;
                  } else if (skill && typeof skill === "object" && "skillName" in skill) {
                    skillName = (skill as any).skillName ?? "Unknown";
                  } else {
                    skillName = "Unknown";
                  }

                  return React.createElement(
                    'div',
                    {
                      key: `skill-${index}-${skillName}`,
                      style: {
                        background: "#a78058",
                        borderRadius: "20px",
                        padding: "10px 20px",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "white",
                        display: "inline-block",
                      },
                    },
                    skillName
                  );
                })
              )
            : null,
          
          // Intro/description
          React.createElement('p', { 
            style: { 
              fontSize: "24px", 
              margin: 0,
              color: "#334155",
              lineHeight: 1.4,
              fontWeight: "400",
            } 
          }, userIntro.length > 120 ? userIntro.substring(0, 120) + '...' : userIntro)
        ),
          
        // Bottom branding
        React.createElement(
          'div',
          {
            style: {
              position: "absolute",
              bottom: "30px",
              right: "60px",
              fontSize: "18px",
              color: "#94a3b8",
              fontWeight: "500",
            }
          },
          'CampusConnect'
        )
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG: Error generating image:', error);
    
    return new ImageResponse(
      React.createElement(
        'div',
        {
          style: {
            fontSize: 48,
            background: "#dc2626",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
          }
        },
        React.createElement('div', { 
          style: { fontSize: 64, marginBottom: 20 } 
        }, '💥'),
        React.createElement('h1', { 
          style: { margin: 0, fontSize: 48 } 
        }, 'Generation Error'),
        React.createElement('p', { 
          style: { margin: "10px 0 0 0", fontSize: 24, opacity: 0.9 } 
        }, 'Failed to create profile image')
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}