/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */


import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";

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
    const userYear = user.enrollmentYear ? `Y${user.enrollmentYear}` : 'Y1';
    const userIntro = user.intro ?? 'Passionate student ready to connect and collaborate!';
    const userImage = user.image ?? '';
    
    // Extract skills (limit to 3 for display)
    const hardSkills = user.hardSkills?.slice(0, 3) ?? [];
    const allSkills = [...hardSkills, ...(user.softSkills?.slice(0, 3 - hardSkills.length) ?? [])];
    
    // Extract social media - find telegram
    const socialMedia = user.socialMedia ?? [];
    const telegramAccount = socialMedia.find((s: any) => s.platform === 'telegram');
    const telegramHandle = telegramAccount?.username ?? '';

    // Main namecard-style profile image
    return new ImageResponse(
      React.createElement(
        'div',
        {
          style: {
            width: "1200px",
            height: "630px",
            display: "flex",
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            position: "relative",
            background: "#ffffff",
          }
        },
        
        // Blue section (30% of width)
        React.createElement(
          'div',
          {
            style: {
              width: "360px",
              height: "630px",
              background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
            }
          }
        ),
        
        // Gold border
        React.createElement('div', {
          style: {
            width: "12px",
            height: "630px",
            background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
          }
        }),
        
        // White section content
        React.createElement(
          'div',
          {
            style: {
              width: "828px",
              height: "630px",
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "60px 60px 60px 120px",
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
              }
            },
            React.createElement('h1', { 
              style: { 
                fontSize: "64px", 
                margin: 0,
                fontWeight: "800",
                lineHeight: 1,
                marginRight: "24px",
                color: "#1e293b",
              } 
            }, userName),
            telegramHandle ? React.createElement(
              'div',
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  fontSize: "24px",
                  color: "#0ea5e9",
                  fontWeight: "500",
                }
              },
              React.createElement('div', {
                style: {
                  width: "32px",
                  height: "32px",
                  borderRadius: "16px",
                  background: "#0ea5e9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontSize: "16px",
                }
              }, '📱'),
              `@${telegramHandle}`
            ) : null
          ),
          
          // Course and year
          React.createElement('p', { 
            style: { 
              fontSize: "32px", 
              margin: "0 0 32px 0",
              color: "#475569",
              fontWeight: "500",
            } 
          }, `SMU ${userCourse} ${userYear}`),
          
          // Skills badges
          allSkills.length > 0 ? React.createElement(
            'div',
            {
              style: {
                display: "flex",
                gap: "16px",
                marginBottom: "32px",
                flexWrap: "wrap",
              }
            },
            ...allSkills.map((skill: any, index: number) => 
              React.createElement(
                'div',
                {
                  key: index,
                  style: {
                    background: "#a78058",
                    borderRadius: "50px",
                    padding: "12px 24px",
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "white",
                  }
                },
                skill.skillName ?? skill
              )
            )
          ) : null,
          
          // Intro/description
          React.createElement('p', { 
            style: { 
              fontSize: "26px", 
              margin: 0,
              color: "#334155",
              lineHeight: 1.4,
              maxWidth: "450px",
            } 
          }, userIntro)
        ),
        
        // Profile photo - positioned absolutely to overlap
        userImage ? 
          React.createElement('img', {
            src: userImage,
            style: {
              position: "absolute",
              left: "246px", // 360 - 140 + 6 (center on gold border)
              top: "175px", // (630 - 280) / 2
              width: "280px",
              height: "280px",
              borderRadius: "140px",
              border: "8px solid white",
              objectFit: "cover",
              zIndex: "10",
            }
          }) :
          React.createElement(
            'div',
            {
              style: {
                position: "absolute",
                left: "246px",
                top: "175px",
                width: "280px",
                height: "280px",
                borderRadius: "140px",
                border: "8px solid white",
                background: "linear-gradient(135deg, #a78058 0%, #8a6f47 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "100px",
                fontWeight: "bold",
                color: "white",
                zIndex: "10",
              }
            },
            userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2)
          ),
          
        // Bottom branding
        React.createElement(
          'div',
          {
            style: {
              position: "absolute",
              bottom: "40px",
              right: "60px",
              fontSize: "20px",
              color: "#64748b",
              fontWeight: "500",
            }
          },
          'Created by CampusConnect'
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