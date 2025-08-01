"use client"
import React, { useEffect } from 'react';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Separator } from '~/components/ui/separator';
import EditProfileModal from '../_components/editProfile';
import NamecardModal from '../_components/generateNameCard';
import type { Skill } from '~/types/skills';
import type { Project } from '~/types/projects';
import type { SocialMedia } from '~/types/socialMedia';
import toast from 'react-hot-toast';
import {
    Download,
    QrCode,
    Edit3,
    MessageCircle,
    Instagram,
    Linkedin,
    Mail,
    ChevronDown,
    ChevronUp,
    CreditCard
} from 'lucide-react';
import { useState } from 'react';
import { Course } from "@prisma/client";
import { api } from '~/trpc/react';

// const ProfilePage = ({ userProfile, onShowQR, onEditProfile, onShowNamecard }) => {
const ProfilePage = () => {
    const utils = api.useUtils();
    const [expandedModules, setExpandedModules] = useState({});
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showNamecard, setShowNamecard] = useState(false)
    // Form state
    const [profile, setProfile] = useState({
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

    const [modules, setUserModules] = useState({})

    const { data: userData } = api.user.getCurrentUser.useQuery();
    const { data: userModules } = api.module.getUserModules.useQuery();


    useEffect(() => {
        if (userData) {
            console.log(userData)
            setProfile({
                name: userData.name || "",
                enrollmentYear: userData.enrollmentYear || 1,
                course: userData.course || "COMPUTER_SCIENCE",
                image: userData.image || "",
                bannerURL: userData.bannerURL || "",
                intro: userData.intro || "",
                hardSkills: userData.hardSkills || [],
                softSkills: userData.softSkills || [],
                project: userData.project || [],
                interest: userData.interest || [],
                socialMedia: userData.socialMedia || [],
            });
        }
    }, [userData]);

    useEffect(() => {
        if (userModules) {
            setUserModules({
                name: userModules.map(module => module.name).join(", ") || "",
                classId: userModules.map(module => module.classId).join(", ") || "",
                prof: userModules.map(module => module.prof).join(", ") || "",
            });
        }
        // name    String
        // classId String           @unique
        // prof    String
        // User    ModulesOnUsers[]
        // userId  String?
    }, [userModules]);

    const onEditProfile = () => setShowEditProfile(true)
    const onShowNamecard = () => setShowNamecard(true)

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    const getSocialIcon = (platform: String) => {
        switch (platform) {
            case 'telegram': return <MessageCircle className="w-4 h-4" />;
            case 'instagram': return <Instagram className="w-4 h-4" />;
            case 'linkedin': return <Linkedin className="w-4 h-4" />;
            case 'email': return <Mail className="w-4 h-4" />;
            default: return <Mail className="w-4 h-4" />;
        }
    };

    const { mutate: editUser, isPending } = api.user.editUser.useMutation({
        onSuccess: () => { toast.success("Profile updated!"); utils.user.invalidate(); },
        onError: (e) => { console.error("Error:", e); toast.error("An error has occured") },
    });

    const handleProfileUpdate = (e, profileData) => {
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
        <div className="h-full overflow-y-auto safe-area-top">
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
                        userMods={modules}
                        userProfile={profile}
                        onClose={() => setShowNamecard(false)}
                    />
                </div>
            )}
            <div className="p-4 space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-primary">My Profile</h1>
                    <div className="flex space-x-2">
                        {/* <Button variant="outline" size="sm" onClick={onShowQR}>
                            <QrCode className="w-4 h-4" />
                        </Button> */}
                        <Button variant="outline" size="sm" onClick={onEditProfile}>
                            <Edit3 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Profile Card - Singpass Style */}
                <Card className="border-2 border-primary/20 overflow-hidden">
                    {/* Header Section with Background */}
                    <div className="relative bg-gradient-to-r from-primary to-secondary p-6 text-white">
                        <div className="flex items-start space-x-4">
                            <Avatar className="w-20 h-20 border-4 border-white">
                                <AvatarImage src={profile.image} />
                                <AvatarFallback className="bg-white text-primary text-xl font-bold">
                                    {profile.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">{profile.name}</h2>
                                <p className="text-white/90">{profile.course.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                                <p className="text-white/80 text-sm">{profile.enrollmentYear}</p>
                            </div>
                        </div>

                        {profile.intro && (
                            <div className="mt-4 p-3 bg-white/10 rounded-lg">
                                <p className="text-sm">{profile.intro}</p>
                            </div>
                        )}
                    </div>

                    {/* Content Sections */}
                    <div className="p-6 space-y-6">
                        {/* Skills Section */}
                        {(profile.softSkills.length > 0 || profile.hardSkills.length > 0) && (
                            <div>
                                <h3 className="font-medium text-primary mb-3">Skills</h3>

                                {profile.softSkills.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Soft Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.softSkills.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full border-0"
                                                    style={{ backgroundColor: '#8a704d', color: '#ffffff' }}
                                                >
                                                    {skill.skillName}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {profile.hardSkills.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Hard Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.hardSkills.map((skill, index) => (
                                                <Badge key={index} variant="default" className="bg-primary text-primary-foreground px-3 py-1 rounded-full">
                                                    {skill.skillName}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Separator className="mt-4" />
                            </div>
                        )}

                        Modules Section
                        {userModules && (
                            <div>
                                <h3 className="font-medium text-primary mb-3">Current Modules</h3>
                                <div className="space-y-2">
                                    {userModules.map((module) => (
                                        <Card key={module.id} className="border border-border/50">
                                            <button
                                                onClick={() => toggleModule(module.id)}
                                                className="w-full p-3 text-left hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="font-medium">{module.code} - {module.classId}</div>
                                                        {expandedModules[module.id] && (
                                                            <div className="mt-2 space-y-1">
                                                                {module.name && (
                                                                    <div className="text-sm text-muted-foreground">
                                                                        <span className="font-medium">Module:</span> {module.name}
                                                                    </div>
                                                                )}
                                                                {module.prof && (
                                                                    <div className="text-sm text-muted-foreground">
                                                                        <span className="font-medium">Professor:</span> {module.prof}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {expandedModules[module.id] ?
                                                        <ChevronUp className="w-4 h-4 text-muted-foreground" /> :
                                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                    }
                                                </div>
                                            </button>
                                        </Card>
                                    ))}
                                </div>
                                <Separator className="mt-4" />
                            </div>
                        )}

                        Interests
                        {profile.interest.length > 0 && (
                            <div>
                                <h3 className="font-medium text-primary mb-3">Interests</h3>
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
                            <h3 className="font-medium text-primary mb-3">Connect</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {profile.socialMedia.map((social, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="justify-start h-auto p-3"
                                        onClick={() => {
                                            // Handle social media link opening
                                            console.log(`Opening ${social.platform}: ${social.username}`);
                                        }}
                                    >
                                        <div className="flex items-center space-x-3 w-full">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                {getSocialIcon(social.platform)}
                                            </div>
                                            <div className="text-left flex-1 min-w-0">
                                                <div className="text-xs text-muted-foreground capitalize">{social.platform}</div>
                                                <div className="text-sm font-medium truncate">{social.username}</div>
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-border/50 p-4">
                        <div className="flex space-x-3">
                            <Button variant="outline" className="flex-1" onClick={onShowNamecard}>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Generate Namecard
                            </Button>
                            {/* <Button onClick={onShowQR} className="bg-primary">
                                <QrCode className="w-4 h-4 mr-2" />
                                Show QR Code
                            </Button> */}
                        </div>
                    </div>
                </Card>

                {/* Bottom Spacing for Navigation */}
                <div className="h-20"></div>
            </div>
        </div>
    );
};

export default ProfilePage;