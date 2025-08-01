"use client";

import { signIn } from "next-auth/react";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import { Card } from '~/components/ui/card';
import Image from "next/image";
import { Camera, Plus, X, Edit3, Mail, Users, MessageSquare, Star, GraduationCap, Heart } from 'lucide-react';
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked:
      "That email is already linked with another provider. Please use the originally linked sign-in method.",
    AccessDenied: "Please use your school email.",
  };

  return (
    <div>
      <div className="bg-base-200">
        {/* Get Started Section */}
        <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-5 px-4 py-5">
          <div className="w-full max-w-md h-full">
            <h3 className="text-2xl font-bold text-primary text-center">Get Started</h3>

            <div className="flex justify-center items-center my-4">
              <div className="w-24 h-24">
                <Image
                  src="/images/CCSquare.jpeg"
                  alt="App Logo"
                  width={100}
                  height={100}
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-xs text-justify px-3">
              CampusConnect is a student-centered platform designed to break down academic silos and foster meaningful connections across SMU.
            </p>

            <Button
              onClick={() => signIn("google")}
              variant="outline"
              className="my-3 w-full h-13 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium shadow-sm mobile-button flex items-center justify-center space-x-3"
            >
              <>
                <div className="w-5 h-5">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <span>Continue with Google</span>
              </>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-base-200 flex flex-col items-center justify-center min-h-screen space-y-5 px-4 py-5 ">
        {/* About Section */}
        <Card className="w-full max-w-sm mb-8 p-6 bg-white/70 backdrop-blur-sm border border-primary/20">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center mb-3">
              <h3 className="text-xl font-bold text-primary mt-2">About Us</h3>
              {/* <div className="w-15 h-15 my-5 flex items-center justify-center">
                <Image
                  src="/images/CCLOGO.png"
                  alt="App Logo"
                  width={80}
                  height={80}
                  priority
                />
              </div> */}
            </div>
            <p className="text-muted-foreground leading-relaxed text-xs text-justify">
              CampusConnect is a student-centered platform designed to break down academic silos and foster meaningful connections across SMU. Whether you&apos;re looking for study partners, project collaborators, or simply want to expand your network, our platform makes it easy to discover fellow students who share your interests and academic goals.
            </p>
          </div>


          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Smart Discovery:</span> Find students by skills, modules, and shared interests
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Project Matching:</span> Connect with teams that need your expertise
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Digital Networking:</span> Share QR codes and digital business cards
              </p>
            </div>
          </div>
        </Card>

        <div className="w-full">
          {error && (
            <div className="mb-4 rounded border-2 border-black bg-red-200 p-4 text-red-800 shadow-[2px_2px_0px_0px_black]">
              {errorMessages[error] ??
                "An unexpected error occurred. Please try again."}
            </div>
          )}
        </div>

        {/* Collaboration Section */}
        <div className="w-full max-w-sm mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-5 h-5 bg-secondary/10 rounded-full flex items-center justify-center mr-2">
                <Heart className="w-3 h-3 text-secondary" />
              </div>
              <h4 className="text-sm font-light text-primary">In collaboration with:</h4>
            </div>

            {/* University Logos */}
            <div className="flex items-center justify-center space-x-5 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <span className="text-primary-foreground font-bold">.hack</span>
              </div>

              {/* .hack Highlight Logo */}
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <span className="text-primary-foreground font-bold">.hack</span>
              </div>

              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <span className="text-primary-foreground font-bold">.hack</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Proudly supported by academic institutions across Singapore
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
