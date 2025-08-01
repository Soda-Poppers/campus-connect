"use client";

import { signIn } from "next-auth/react";
import { Card } from '~/components/ui/card';
import Image from "next/image";
import { GraduationCap, Heart, Users, Zap, Network, ArrowRight } from 'lucide-react';
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked:
      "That email is already linked with another provider. Please use the originally linked sign-in method.",
    AccessDenied: "Please use your school email.",
  };

  const handleGoogleSignIn = async () => {
    if (!isLoading) {
      setIsLoading(true);
      const result = await signIn("google", { redirect: false });

      if (result?.error) {
        console.log(result?.error)
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#151b4d]/5 via-transparent to-[#8a704d]/5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23151b4d&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

        <div className="relative mx-auto max-w-md px-6 pt-12">
          {/* Header */}
          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#151b4d] to-[#8a704d] bg-clip-text text-transparent mb-2">
              Welcome to CampusConnect
            </h1>
            <p className="text-gray-600 text-sm">
              Connect with your SMU community
            </p>
          </div>

          {/* Login Card */}
          <Card className="bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-xl p-8 mb-5">
            <div className="flex flex-col items-center">
              <div className="w-35 h-35">
                <Image
                  src="/images/CCSquare.jpeg"
                  alt="App Logo"
                  width={300}
                  height={300}
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
              <div className="text-center mt-2">
                <p className="text-gray-600 text-sm leading-relaxed">
                  CampusConnect breaks down academic silos and fosters meaningful connections across SMU.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-500 text-xs text-center mb-4">
                Sign in with your university Google account:
              </p>

              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="mt-3 w-full h-13 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium shadow-sm mobile-button flex items-center justify-center"
                variant="outline"
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 group-hover:scale-110 transition-transform duration-200">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />}
                </div>
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <div className="flex items-center space-x-2">
                  <span>
                    {errorMessages[error] ?? "An unexpected error occurred. Please try again."}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Features Preview */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="text-center p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50">
              <Users className="w-6 h-6 text-[#151b4d] mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">Connect</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50">
              <Network className="w-6 h-6 text-[#8a704d] mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">Collaborate</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50">
              <Zap className="w-6 h-6 text-[#151b4d] mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">Discover</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-b from-gray-100 to-white pt-16 pb-5">
        <div className="max-w-md mx-auto px-6">
          <Card className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#151b4d]/10 to-[#8a704d]/10 mb-4">
                <GraduationCap className="w-6 h-6 text-[#151b4d]" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#151b4d] to-[#8a704d] bg-clip-text text-transparent mb-2">
                About CampusConnect
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                A student-centered platform designed to break down academic silos and foster meaningful connections across SMU. Discover fellow students who share your interests and academic goals.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-[#151b4d]/5 to-transparent pl-5">
                <div className="w-2 h-2 bg-gradient-to-r from-[#151b4d] to-[#8a704d] rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-[#151b4d] mb-1">Smart Discovery</p>
                  <p className="text-xs text-gray-600">Find students by skills, modules, and shared interests</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-[#8a704d]/5 to-transparent pl-5">
                <div className="w-2 h-2 bg-gradient-to-r from-[#8a704d] to-[#151b4d] rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-[#151b4d] mb-1">Project Matching</p>
                  <p className="text-xs text-gray-600">Connect with teams that need your expertise</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-[#151b4d]/5 to-transparent pl-5">
                <div className="w-2 h-2 bg-gradient-to-r from-[#151b4d] to-[#8a704d] rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-[#151b4d] mb-1">Digital Networking</p>
                  <p className="text-xs text-gray-600">Share QR codes and digital business cards</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Partnership Section */}
          <Card className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8a704d]/10 to-[#151b4d]/10 flex items-center justify-center mr-2">
                  <Heart className="w-4 h-4 text-[#8a704d]" />
                </div>
                <h3 className="text-sm font-medium text-[#151b4d]">In collaboration with:</h3>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#151b4d] to-[#8a704d] rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <span className="text-white font-bold text-xs">.hack</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#8a704d] to-[#151b4d] rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <span className="text-white font-bold text-xs">.hack</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#151b4d] to-[#8a704d] rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <span className="text-white font-bold text-xs">.hack</span>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Proudly supported by academic institutions across Singapore.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
