"use client";

import { signIn } from "next-auth/react";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import { Card } from "~/components/ui/card";
import Image from "next/image";
import {
  Camera,
  Plus,
  X,
  Edit3,
  Mail,
  Users,
  MessageSquare,
  Star,
  GraduationCap,
  Heart,
  Sparkles,
  Shield,
  Globe,
} from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-[#8a704d] via-[#151b4d] to-slate-900">
      {/* Animated background elements */}

      {/* Grid pattern overlay */}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 pt-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/10 p-2 backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-4xl font-bold text-transparent text-white md:text-6xl">
            Welcome to CampusConnect
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Break down academic silos and forge meaningful connections across
            SMU
          </p>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-12 lg:flex-row">
          {/* Login Card */}
          <div className="w-full max-w-md">
            <Card className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-lg">
              <div className="p-8">
                <div className="mb-8 text-center">
                  <div className="relative mx-auto mb-6 h-20 w-20">
                    <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <div className="absolute inset-1 flex items-center justify-center rounded-xl bg-white">
                      <Image
                        src="/images/CCSquare.jpeg"
                        alt="App Logo"
                        width={64}
                        height={64}
                        className="rounded-lg object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    Get Started
                  </h3>
                  <p className="text-sm text-slate-300">
                    Join the future of student networking
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/20 p-4 backdrop-blur-sm">
                    <p className="text-sm text-red-200">
                      {errorMessages[error] ??
                        "An unexpected error occurred. Please try again."}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => signIn("google")}
                  className="group h-12 w-full rounded-xl bg-white font-medium text-gray-900 shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      Continue with Google
                    </span>
                  </div>
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-400">
                    By continuing, you agree to our Terms of Service
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Features Section */}
          <div className="w-full max-w-md space-y-6">
            {/* About Card */}
            <Card className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300 hover:bg-white/10">
              <div className="mb-4 flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  About CampusConnect
                </h3>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                Whether you're looking for study partners, project
                collaborators, or simply want to expand your network, our
                platform makes it easy to discover fellow students who share
                your interests and academic goals.
              </p>

              <div className="space-y-4">
                <div className="group flex items-start space-x-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 transition-transform duration-300 group-hover:scale-110">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      Smart Discovery
                    </h4>
                    <p className="text-xs text-slate-400">
                      Find students by skills, modules, and shared interests
                    </p>
                  </div>
                </div>

                <div className="group flex items-start space-x-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 transition-transform duration-300 group-hover:scale-110">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      Project Matching
                    </h4>
                    <p className="text-xs text-slate-400">
                      Connect with teams that need your expertise
                    </p>
                  </div>
                </div>

                <div className="group flex items-start space-x-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      Digital Networking
                    </h4>
                    <p className="text-xs text-slate-400">
                      Share QR codes and digital business cards
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Collaboration Card */}
            <Card className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300 hover:bg-white/10">
              <div className="text-center">
                <div className="mb-4 flex items-center justify-center">
                  <Heart className="mr-2 h-5 w-5 text-pink-400" />
                  <h4 className="font-medium text-white">
                    In collaboration with
                  </h4>
                </div>

                <div className="mb-4 flex items-center justify-center space-x-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
                      style={{ animationDelay: `${i * 200}ms` }}
                    >
                      <span className="text-sm font-bold text-white">
                        .hack
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-400">
                  Proudly supported by academic institutions across Singapore
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pb-8 text-center">
          <p className="text-sm text-slate-500">
            © 2024 CampusConnect. Connecting minds, building futures.
          </p>
        </div>
      </div>
    </div>
  );
}
