/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */

"use client";

import React, { useState, useEffect, useCallback, type JSX } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  X,
  User,
  GraduationCap,
  BookOpen,
  Briefcase,
  Heart,
  Send,
  Icon,
  Mail,
  Check,
} from "lucide-react";
import { api } from "~/trpc/react";
import Link from "next/link";
import SkillInput from "../_components/WelcomeFlow/SkillInput";
import type { Skill } from "~/types/skills";
import type { SocialMedia } from "~/types/socialMedia";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
// import SocialMediaInput from "../_components/WelcomeFlow/SocialMediaInput";


// Types based on your Prisma schema
interface Module {
  id: string;
  name: string;
  classId: string;
  prof: string;
  isNew?: boolean; // Keep this for newly created modules
}

interface NewModuleForm {
  name: string;
  prof: string;
  classId: string;
}

interface FormData {
  name: string;
  enrollmentYear: string;
  course: string;
  modules: Module[];
  project: string;
  interests: Skill[];
  hardSkills: Skill[];
  softSkills: Skill[];
  socialMedia: SocialMedia[]
}

interface Step {
  id: keyof FormData;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  required: boolean;
}

// Course enum matching your Prisma schema
enum Course {
  COMPUTER_SCIENCE = "COMPUTER_SCIENCE",
  INFORMATION_SYSTEMS = "INFORMATION_SYSTEMS",
  ACCOUNTANCY = "ACCOUNTANCY",
  BUSINESS_MANAGEMENT = "BUSINESS_MANAGEMENT",
  ECONOMICS = "ECONOMICS",
  COMPUTING_AND_LAW = "COMPUTING_AND_LAW",
  SOFTWARE_ENGINEERING = "SOFTWARE_ENGINEERING",
  LAW = "LAW",
  SOCIAL_SCIENCE = "SOCIAL_SCIENCE",
  INTEGRATIVE_STUDIES = "INTEGRATIVE_STUDIES",
  SMU_DUKE_NUS_PATHWAY = "SMU_DUKE_NUS_PATHWAY",
}

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

const ProfileWelcomeFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form data
  const [formData, setFormData] = useState<FormData>({
    name: "",
    enrollmentYear: "",
    course: "",
    modules: [],
    project: "",
    interests: [],
    hardSkills: [],
    softSkills: [],
    socialMedia: []
  });

  // Module search state
  const [moduleSearch, setModuleSearch] = useState<string>("");
  const [moduleResults, setModuleResults] = useState<Module[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // New module form state
  const [showNewModuleForm, setShowNewModuleForm] = useState<boolean>(false);
  const [newModuleForm, setNewModuleForm] = useState<NewModuleForm>({
    name: "",
    prof: "",
    classId: "",
  });

  const platforms = ['telegram', 'instagram', 'linkedin', 'email']

  const steps: Step[] = [
    {
      id: "name",
      title: "What's your name?",
      icon: User,
      required: true,
    },
    {
      id: "enrollmentYear",
      title: "When did you enroll?",
      icon: GraduationCap,
      required: true,
    },
    {
      id: "course",
      title: "What's your course?",
      icon: BookOpen,
      required: true,
    },
    {
      id: "modules",
      title: "What modules are you taking?",
      icon: BookOpen,
      required: true,
    },
    {
      id: "hardSkills",
      title: "What are some hard skills you have?",
      icon: BookOpen,
      required: false,
    },
    {
      id: "softSkills",
      title: "What are some soft skills you have?",
      icon: BookOpen,
      required: false,
    },
    {
      id: "interests",
      title: "What are your interests?",
      icon: Heart,
      required: false,
    },
    {
      id: "socialMedia",
      title: "How can others contact you?",
      icon: Mail,
      required: false,
    },
  ];

  // Search modules with debouncing
  const createUserMutation = api.user.create.useMutation();
  const searchModulesQuery = api.module.search.useQuery(
    { query: moduleSearch },
    {
      enabled: moduleSearch.length >= 2,
      refetchOnWindowFocus: false,
    },
  );

  // Update the searchModules function to use TRPC
  const searchModules = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setModuleResults([]);
      return;
    }

    setIsSearching(true);
    // The actual search is handled by the TRPC query above
    // Results will be available in searchModulesQuery.data
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      void searchModules(moduleSearch);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [moduleSearch, searchModules]);

  const currentStepData = steps[currentStep];

  const isStepValid = useCallback((): boolean => {
    const step = currentStepData?.id;

    if (!currentStepData?.required) return true;

    switch (step) {
      case "name":
        return formData.name.trim().length > 0;
      case "enrollmentYear":
        const max = 2030;
        const min = 1990;
        const value = Number(formData.enrollmentYear);
        return (
          formData.enrollmentYear.length === 4 &&
          !isNaN(Number(formData.enrollmentYear)) &&
          value >= min &&
          value <= max
        );
      case "course":
        return formData.course !== "";
      case "modules":
        return formData.modules.length > 0;
      default:
        return true;
    }
  }, [currentStepData, formData]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, steps.length]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  useEffect(() => {
    if (searchModulesQuery.data) {
      setModuleResults(searchModulesQuery.data);
      setIsSearching(false);
    } else if (searchModulesQuery.isLoading) {
      setIsSearching(true);
    } else if (searchModulesQuery.isError) {
      setModuleResults([]);
      setIsSearching(false);
    }
  }, [
    searchModulesQuery.data,
    searchModulesQuery.isLoading,
    searchModulesQuery.isError,
  ]);

  // Update the handleSubmit function to use TRPC
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      console.log(formData)
      await createUserMutation.mutateAsync({
        name: formData.name,
        enrollmentYear: parseInt(formData.enrollmentYear),
        course: formData.course as Course,
        modules: formData.modules, // Send the full module objects instead of just IDs
        project: formData.project || undefined,
        interests: formData.interests || undefined,
        hardSkills: formData.hardSkills || [],
        softSkills: formData.softSkills || [],
        socialMedia: formData.socialMedia || []
      });

      setIsCompleted(true);
      // Optionally redirect or update UI state
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Error creating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, createUserMutation]);

  const addModule = useCallback(
    (module: Module) => {
      if (!formData.modules.find((m) => m.id === module.id)) {
        setFormData((prev) => ({
          ...prev,
          modules: [...prev.modules, module],
        }));
      }
      setModuleSearch("");
      setModuleResults([]);
    },
    [formData.modules],
  );

  const removeModule = useCallback((moduleId: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== moduleId),
    }));
  }, []);

  // Updated function to show new module form instead of directly creating
  const showCreateNewModuleForm = useCallback(() => {
    setNewModuleForm({
      name: "",
      prof: "",
      classId: moduleSearch.trim(),
    });
    setShowNewModuleForm(true);
  }, [moduleSearch]);

  // Function to handle creating a new module with all details
  const createNewModule = useCallback(() => {
    const { name, prof, classId } = newModuleForm;

    if (name.trim() && prof.trim() && classId.trim()) {
      const newModule: Module = {
        id: `new-${Date.now()}`,
        name: name.trim(),
        classId: classId.trim(),
        prof: prof.trim(),
        isNew: true,
      };

      addModule(newModule);

      // Reset form and close modal
      setNewModuleForm({ name: "", prof: "", classId: "" });
      setShowNewModuleForm(false);
      setModuleSearch("");
    }
  }, [newModuleForm, addModule]);

  // Function to cancel new module creation
  const cancelNewModule = useCallback(() => {
    setNewModuleForm({ name: "", prof: "", classId: "" });
    setShowNewModuleForm(false);
  }, []);

  const updateFormField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const updateNewModuleField = useCallback(
    <K extends keyof NewModuleForm>(field: K, value: NewModuleForm[K]) => {
      setNewModuleForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const renderStepContent = (): JSX.Element => {
    const step = currentStepData?.id;

    switch (step) {
      case "name":
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => updateFormField("name", e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg transition-colors focus:border-primary focus:outline-none"
              autoFocus
            />
          </div>
        );

      case "enrollmentYear":
        return (
          <div className="space-y-4">
            <input
              type="number"
              placeholder="e.g., 2023"
              min="1900"
              max="2030"
              value={formData.enrollmentYear}
              onChange={(e) => {
                const min = 1990;
                const max = 2030;

                // keep only digits, limit to 4 characters
                let raw = e.target.value.replace(/\D/g, "");
                if (raw.length > 4) raw = raw.slice(0, 4);
                updateFormField("enrollmentYear", raw);
              }}
              onBlur={() => {
                const year = parseInt(formData.enrollmentYear, 10);
                if (isNaN(year)) return;
                let clamped = year;
                if (clamped > 2030) clamped = 2030;
                if (clamped < 1990) clamped = 1990;
                if (
                  clamped.toString() !== formData.enrollmentYear &&
                  clamped > 1990 &&
                  clamped < 2030
                ) {
                  updateFormField("enrollmentYear", clamped.toString());
                }
              }}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg transition-colors focus:border-primary-500 focus:outline-none"
              autoFocus
            />
            {formData.enrollmentYear &&
              (() => {
                const year = parseInt(formData.enrollmentYear, 10);
                if (isNaN(year) || year < 1990 || year > 2030) {
                  return (
                    <p className="text-sm text-red-500">
                      Year must be between 1990 and 2030.
                    </p>
                  );
                }
                if (formData.enrollmentYear.length !== 4) {
                  return (
                    <p className="text-sm text-yellow-500">
                      Enter a 4-digit year.
                    </p>
                  );
                }
                return null;
              })()}
          </div>
        );

      case "course":
        return (
          <div className="space-y-3">
            {Object.entries(Course).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => updateFormField("course", value)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${formData.course === value
                  ? "border-primary  bg-primary text-white"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                {CourseDisplayNames[value]}
              </button>
            ))}
          </div>
        );

      case "modules":
        return (
          <div className="space-y-4">
            {/* Selected modules */}
            {formData.modules.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Selected Modules:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.modules.map((module) => (
                    <div
                      key={module.id}
                      className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-white "
                    >
                      <span className="text-sm">
                        <span className="font-medium">{module.name}</span>
                        {module.classId && (
                          <span className="text-primary ">
                            {" "}
                            ({module.classId})
                          </span>
                        )}
                        {module.isNew && (
                          <span className="text-green-600"> (New)</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeModule(module.id)}
                        className="text-primary-600 hover:text-primary-800"
                        aria-label={`Remove ${module.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module search */}
            {!showNewModuleForm && (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for modules..."
                    value={moduleSearch}
                    onChange={(e) => setModuleSearch(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-10 text-lg transition-colors focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Search results */}
                {(moduleResults.length > 0 ||
                  (moduleSearch.length > 0 && !isSearching)) && (
                    <div className="absolute top-full right-0 left-0 z-10 mt-2 max-h-60 overflow-y-auto rounded-xl border-2 border-gray-200 bg-white shadow-lg">
                      {moduleResults.map((module) => (
                        <button
                          key={module.id}
                          type="button"
                          onClick={() => addModule(module)}
                          className="w-full border-b border-gray-100 p-3 text-left last:border-b-0 hover:bg-gray-50"
                        >
                          <div className="font-medium">{module.name}</div>
                          <div className="text-sm text-gray-600">
                            {module.classId} • {module.prof}
                          </div>
                        </button>
                      ))}

                      {moduleResults.length === 0 &&
                        moduleSearch.length > 0 &&
                        !isSearching && (
                          <button
                            type="button"
                            onClick={showCreateNewModuleForm}
                            className="w-full border-b border-gray-100 p-3 text-left hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              <span>
                                Create new module: &quot;{moduleSearch}&quot;
                              </span>
                            </div>
                          </button>
                        )}
                    </div>
                  )}
              </div>
            )}

            {/* New Module Form */}
            {showNewModuleForm && (
              <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-4">
                <h4 className="mb-3 font-medium text-primary-800">
                  Create New Module
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Module Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Advanced Database Systems"
                      value={newModuleForm.name}
                      onChange={(e) =>
                        updateNewModuleField("name", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Class ID *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., CS3223"
                      value={newModuleForm.classId}
                      onChange={(e) =>
                        updateNewModuleField("classId", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Professor *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Dr. Smith"
                      value={newModuleForm.prof}
                      onChange={(e) =>
                        updateNewModuleField("prof", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={createNewModule}
                      disabled={
                        !newModuleForm.name.trim() ||
                        !newModuleForm.prof.trim() ||
                        !newModuleForm.classId.trim()
                      }
                      className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      Add Module
                    </button>
                    <button
                      type="button"
                      onClick={cancelNewModule}
                      className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "hardSkills":
        return (
          <SkillInput
            label="Hard Skills"
            skills={formData.hardSkills}
            onChange={(skills) => updateFormField("hardSkills", skills)}
          />
        );
      case "softSkills":
        return (
          <SkillInput
            label="Soft Skills"
            skills={formData.softSkills}
            onChange={(skills) => updateFormField("softSkills", skills)}
          />
        );

      case "interests":
        return (
          <div className="space-y-4">
            <SkillInput
              label="Interests"
              skills={formData.interests}
              onChange={(skills) => updateFormField("interests", skills)}
              placeholder="Type an interest and press Enter"
            />
          </div>
        );

      case "socialMedia":
        return (
          <div className="space-y-1">
            <label className="block text-sm font-medium">Social Media (optional)</label>
            <div className="space-y-2">
              <div className="space-y-3">

                <div>
                  <Label htmlFor="edit-telegram">Telegram</Label>
                  <Input
                    id="edit-telegram"
                    value={formData.socialMedia.find(social => social.platform === 'telegram')?.username || ''}
                    onChange={(e) => {
                      const updatedSocialMedia = formData.socialMedia.filter(social => social.platform !== 'telegram');
                      updateFormField('socialMedia', [
                        ...updatedSocialMedia,
                        { platform: 'telegram', username: e.target.value }
                      ]);
                    }}
                    placeholder="@username"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-instagram">Instagram</Label>
                  <Input
                    id="edit-instagram"
                    value={formData.socialMedia.find(social => social.platform === 'instagram')?.username || ''}
                    onChange={(e) => {
                      const updatedSocialMedia = formData.socialMedia.filter(social => social.platform !== 'instagram');
                      updateFormField('socialMedia', [
                        ...updatedSocialMedia,
                        { platform: 'instagram', username: e.target.value }
                      ]);
                    }}
                    placeholder="@username"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-linkedin">LinkedIn</Label>
                  <Input
                    id="edit-linkedin"
                    value={formData.socialMedia.find(social => social.platform === 'linkedin')?.username || ''}
                    onChange={(e) => {
                      const updatedSocialMedia = formData.socialMedia.filter(social => social.platform !== 'linkedin');
                      updateFormField('socialMedia', [
                        ...updatedSocialMedia,
                        { platform: 'linkedin', username: e.target.value }
                      ]);
                    }}
                    placeholder="linkedin.com/in/username"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={formData.socialMedia.find(social => social.platform === 'email')?.username || ''}
                    onChange={(e) => {
                      const updatedSocialMedia = formData.socialMedia.filter(social => social.platform !== 'email');
                      updateFormField('socialMedia', [
                        ...updatedSocialMedia,
                        { platform: 'email', username: e.target.value }
                      ]);
                    }}
                    placeholder="your.email@smu.edu.sg"
                  />
                </div>
              </div>

            </div>
          </div>
        )

      default:
        return <div>Invalid step</div>;

    }
  };

  const IconComponent = currentStepData?.icon;

  if (isCompleted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
            {/* Success animation/icon */}
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                  <Check className="h-8 w-8 text-white" />
                </div>
                {/* Success ring animation */}
                <div className="absolute inset-0 animate-ping rounded-full border-4 border-green-200"></div>
              </div>
            </div>

            {/* Success message */}
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              🎉 Welcome to the Community!
            </h1>
            <p className="mb-2 text-lg text-gray-700">
              Hi{" "}
              <span className="font-semibold text-green-600">
                {formData.name}
              </span>
              !
            </p>
            <p className="mb-8 text-gray-600">
              Your profile has been created successfully. You&apos;re all set to
              connect with fellow students, discover study groups, and explore
              exciting opportunities.
            </p>

            {/* Profile summary */}

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                type="button"
                href="/profile"
                className="btn btn-wite flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
              >
                <BookOpen className="h-5 w-5" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-secondary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Step header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/100">
              {IconComponent && (
                <IconComponent className="h-8 w-8 text-white" />
              )}
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              {currentStepData?.title}
            </h2>
            {currentStepData?.required && (
              <p className="text-gray-600">This field is required</p>
            )}
          </div>

          {/* Step content */}
          <div className="mb-8 text-black">{renderStepContent()}</div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Complete Profile
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-white transition-colors hover:bg-primary
                 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWelcomeFlow;
