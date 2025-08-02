import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import type { Skill } from '~/types/skills';
import type { Project } from '~/types/projects';
import type { SocialMedia } from '~/types/socialMedia';
import {
    X,
    Plus,
    Camera,
    Save,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { Course } from '@prisma/client';


interface Module {
    id?: number;
    name: string;
    prof: string;
    classId: string;
}

interface UserProfile {
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
    socialMedia: SocialMedia[]
}

interface Props {
    open: boolean;
    userProfile: UserProfile;
    onSave: (e: React.MouseEvent<HTMLButtonElement>, data: UserProfile) => void;
    onClose: () => void;
}

interface ExpandedSections {
    basic: boolean;
    skills: boolean;
    modules: boolean;
    interests: boolean;
    socials: boolean;
}

interface SectionHeaderProps {
    title: string;
    section: keyof ExpandedSections;
    children: React.ReactNode;
}

const EditProfileModal: React.FC<Props> = ({ open, userProfile, onSave, onClose }) => {
    const [formData, setFormData] = useState<UserProfile>({
        ...userProfile,
    });
    const [newSkill, setNewSkill] = useState<string>('');
    const [skillType, setSkillType] = useState<'soft' | 'hard'>('soft');
    const [newModule, setNewModule] = useState<Module>({ name: '', prof: '', classId: '' });
    const [newInterest, setNewInterest] = useState<string>('');
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [showModuleDialog, setShowModuleDialog] = useState<boolean>(false);
    const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
        basic: true,
        skills: false,
        modules: false,
        interests: false,
        socials: false
    });

    const courseOptions = Object.entries(Course).map(([key, value]) => ({
        value: key,
        label: value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
    }));

    // Fix the field name mismatch issue
    const handleInputChange = useCallback((field: keyof UserProfile, value: string) => {
        setFormData((prev: UserProfile) => ({ ...prev, [field]: value }));
    }, []);

    // Optimize social media handling to prevent unnecessary re-renders
    const handleSocialChange = useCallback((platform: string, value: string) => {
        setFormData((prev: UserProfile) => {
            const socialMedia: SocialMedia[] = prev.socialMedia ?? [];
            const existing = socialMedia.find(s => s.platform === platform);

            if (existing) {
                // Update existing platform
                return {
                    ...prev,
                    socialMedia: socialMedia.map(s =>
                        s.platform === platform ? { ...s, username: value } : s
                    )
                };
            } else {
                // Add new platform entry
                return {
                    ...prev,
                    socialMedia: [...socialMedia, { platform, username: value }]
                };
            }
        });
    }, []);

    const addSkill = () => {
        if (newSkill.trim()) {
            const skillArray = skillType === 'soft' ? 'softSkills' : 'hardSkills';
            const currentSkills = formData[skillArray] ?? [];
            if (currentSkills.length < 5 && !currentSkills.some((skill: Skill) => skill.skillName === newSkill.trim())) {
                setFormData((prev: UserProfile) => ({
                    ...prev,
                    [skillArray]: [...currentSkills, { skillName: newSkill.trim() }]
                }));
                setNewSkill('');
            }
        }
    };

    const removeSkill = (index: number, type: 'soft' | 'hard') => {
        const skillArray = type === 'soft' ? 'softSkills' : 'hardSkills';
        const currentSkills = formData[skillArray] ?? [];
        setFormData((prev: UserProfile) => ({
            ...prev,
            [skillArray]: currentSkills.filter((_: Skill, i: number) => i !== index)
        }));
    };

    // const addModule = () => {
    //     if (newModule.classId.trim() && newModule.name.trim()) {
    //         setFormData((prev: UserProfile) => ({
    //             ...prev,
    //             modules: [...(prev.modules || []), { ...newModule, id: Date.now() }]
    //         }));
    //         setNewModule({ name: '', prof: '', classId: '' });
    //         setShowModuleDialog(false);
    //     }
    // };

    // const editModule = (module: Module) => {
    //     setEditingModule(module);
    //     setNewModule({ ...module });
    //     setShowModuleDialog(true);
    // };

    // const updateModule = () => {
    //     if (editingModule) {
    //         setFormData(prev => ({
    //             ...prev,
    //             modules: (prev.modules || []).map(m => m.id === editingModule.id ? { ...newModule } : m)
    //         }));
    //         setNewModule({  name: '', prof: '', classId: '' });
    //         setEditingModule(null);
    //         setShowModuleDialog(false);
    //     }
    // };

    // const removeModule = (index: number) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         modules: (prev.modules || []).filter((_, i) => i !== index)
    //     }));
    // };

    const addInterest = () => {
        if (newInterest.trim()) {
            const interests = formData.interest ?? [];
            if (interests.length < 5 && !interests.some((interest: Skill) => interest.skillName === newInterest.trim())) {
                setFormData((prev: UserProfile) => ({
                    ...prev,
                    interest: [...interests, { skillName: newInterest.trim() }]
                }));
                setNewInterest('');
            }
        }
    };

    const removeInterest = (index: number) => {
        setFormData((prev: UserProfile) => ({
            ...prev,
            interest: (prev.interest ?? []).filter((_, i) => i !== index)
        }));
    };

    const toggleSection = (section: keyof ExpandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        onSave(e, formData);
        onClose();
    };

    const SectionHeader: React.FC<SectionHeaderProps> = ({ title, section, children }) => (
        <div className="border border-border rounded-lg">
            <button
                onClick={() => toggleSection(section)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors rounded-t-lg"
            >
                <h3 className="font-medium text-primary">{title}</h3>
                {expandedSections[section] ?
                    <ChevronUp className="w-4 h-4 text-muted-foreground" /> :
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                }
            </button>
            {expandedSections[section] && (
                <div className="p-4 border-t border-border">
                    {children}
                </div>
            )}
        </div>
    );

    // Get social media values safely
    const getSocialValue = (platform: string): string => {
        return formData.socialMedia?.find(s => s.platform === platform)?.username ?? '';
    };

    useEffect(() =>
        console.log(formData), [formData])
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Edit Profile</DialogTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <DialogDescription className="sr-only">
                        Edit your profile information including basic details, skills, modules, interests, and social profiles
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Profile Photo */}
                    <div className="text-center">
                        <div className="relative inline-block">
                            <Avatar className="w-24 h-24 border-4 border-primary/20">
                                <AvatarImage src={formData.image} />
                                <AvatarFallback className="bg-muted text-xl">
                                    {formData.name?.split(' ').map(n => n[0]).join('') ?? 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                                <Camera className="w-4 h-4 text-primary-foreground" />
                            </button>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <SectionHeader title="Basic Information" section="basic">
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name ?? ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-degree">Degree Program</Label>
                                <select
                                    id="edit-degree"
                                    value={formData.course ?? ''}
                                    onChange={(e) => handleInputChange('course', e.target.value)}
                                    className="border border-input bg-background text-foreground rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    {courseOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="edit-year">Year of Enrollment</Label>
                                <Input
                                    id="edit-year"
                                    type="number"
                                    value={formData.enrollmentYear ?? ''}
                                    onChange={(e) => handleInputChange('enrollmentYear', e.target.value)}
                                    placeholder="e.g., 2023"
                                    min={2000}
                                    max={new Date().getFullYear()}
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-intro">Introduction (100 characters max)</Label>
                                <Textarea
                                    id="edit-intro"
                                    value={formData.intro ?? ''}
                                    onChange={(e) => handleInputChange('intro', e.target.value.slice(0, 100))}
                                    placeholder="Brief self-description..."
                                    className="min-h-[80px]"
                                    maxLength={100}
                                />
                                <div className="text-right text-sm text-muted-foreground mt-1">
                                    {(formData.intro ?? '').length}/100
                                </div>
                            </div>
                        </div>
                    </SectionHeader>

                    {/* Skills */}
                    <SectionHeader title="Skills" section="skills">
                        <div className="space-y-4">
                            {/* Add Skills */}
                            <div>
                                <div className="flex space-x-2 mb-3">
                                    <Button
                                        variant={skillType === 'soft' ? 'default' : 'outline'}
                                        onClick={() => setSkillType('soft')}
                                        className="flex-1 text-sm"
                                    >
                                        Soft Skills
                                    </Button>
                                    <Button
                                        variant={skillType === 'hard' ? 'default' : 'outline'}
                                        onClick={() => setSkillType('hard')}
                                        className="flex-1 text-sm"
                                    >
                                        Hard Skills
                                    </Button>
                                </div>

                                <div className="flex space-x-2">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder={`Add ${skillType} skill...`}
                                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                    />
                                    <Button onClick={addSkill} size="icon">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Soft Skills */}
                            <div>
                                <Label>Soft Skills ({(formData.softSkills ?? []).length}/5)</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(formData.softSkills ?? []).map((skill, index) => (
                                        <Badge
                                            key={index}
                                            className="px-3 py-1 rounded-full border-0"
                                            style={{ backgroundColor: '#8a704d', color: '#ffffff' }}
                                        >
                                            {skill.skillName}
                                            <button onClick={() => removeSkill(index, 'soft')} className="ml-2">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Hard Skills */}
                            <div>
                                <Label>Hard Skills ({(formData.hardSkills ?? []).length}/5)</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(formData.hardSkills ?? []).map((skill, index) => (
                                        <Badge key={index} variant="default" className="bg-primary/20">
                                            {skill.skillName}
                                            <button onClick={() => removeSkill(index, 'hard')} className="ml-2">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionHeader>

                    {/* Modules */}
                    <SectionHeader title="Current Modules" section="modules">
                        <div className="space-y-4">
                            {/* Add Module */}
                            <Button
                                onClick={() => setShowModuleDialog(true)}
                                variant="outline"
                                className="w-full h-auto p-3 border-dashed"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Module
                            </Button>
                        </div>
                    </SectionHeader>

                    {/* Interests & Activities */}
                    <SectionHeader title="Interests & Activities" section="interests">
                        <div className="space-y-4">
                            {/* Add Interests */}
                            <div>
                                <Label>Interests</Label>
                                <div className="flex space-x-2 mt-2">
                                    <Input
                                        value={newInterest}
                                        onChange={(e) => setNewInterest(e.target.value)}
                                        placeholder="Add an interest..."
                                        onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                                    />
                                    <Button onClick={addInterest} size="icon">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(formData.interest ?? []).map((interest, index) => (
                                        <Badge key={index} variant="outline">
                                            {interest.skillName}
                                            <button onClick={() => removeInterest(index)} className="ml-2">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionHeader>

                    {/* Social Media */}
                    <SectionHeader title="Social Profiles" section="socials">
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="edit-telegram">Telegram</Label>
                                <Input
                                    id="edit-telegram"
                                    value={getSocialValue('telegram')}
                                    onChange={(e) => handleSocialChange('telegram', e.target.value)}
                                    placeholder="@username"
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-instagram">Instagram</Label>
                                <Input
                                    id="edit-instagram"
                                    value={getSocialValue('instagram')}
                                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                    placeholder="@username"
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-linkedin">LinkedIn</Label>
                                <Input
                                    id="edit-linkedin"
                                    value={getSocialValue('linkedin')}
                                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                    placeholder="linkedin.com/in/username"
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    value={getSocialValue('email')}
                                    onChange={(e) => handleSocialChange('email', e.target.value)}
                                    placeholder="your.email@smu.edu.sg"
                                />
                            </div>
                        </div>
                    </SectionHeader>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-border p-4">
                    <div className="flex space-x-3">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="flex-1 bg-primary">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Module Dialog */}
                <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
                    <DialogContent className="max-w-md mx-auto">
                        <DialogHeader>
                            <DialogTitle>{editingModule ? 'Edit Module' : 'Add Module'}</DialogTitle>
                            <DialogDescription>
                                {editingModule ? 'Update your module information' : 'Add a new module to your profile'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="moduleCode">Module Code</Label>
                                    <Input
                                        id="moduleCode"
                                        value={newModule.classId}
                                        onChange={(e) => setNewModule(prev => ({ ...prev, code: e.target.value }))}
                                        placeholder="CS101"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="classId">Class ID</Label>
                                    <Input
                                        id="classId"
                                        value={newModule.classId}
                                        onChange={(e) => setNewModule(prev => ({ ...prev, classId: e.target.value }))}
                                        placeholder="G1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="moduleName">Module Name</Label>
                                <Input
                                    id="moduleName"
                                    value={newModule.name}
                                    onChange={(e) => setNewModule(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Introduction to Programming"
                                />
                            </div>

                            <div>
                                <Label htmlFor="professor">Professor (Optional)</Label>
                                <Input
                                    id="professor"
                                    value={newModule.prof}
                                    onChange={(e) => setNewModule(prev => ({ ...prev, prof: e.target.value }))}
                                    placeholder="Prof. Smith"
                                />
                            </div>

                            {/* <div className="flex space-x-3 pt-4">
                                <Button variant="outline" onClick={() => {
                                    setShowModuleDialog(false);
                                    setEditingModule(null);
                                    setNewModule({ name: '', prof: '', classId: '' });
                                }} className="flex-1">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={editingModule ? updateModule : addModule}
                                    className="flex-1 bg-primary"
                                    disabled={!newModule.classId || !newModule.name}
                                >
                                    {editingModule ? 'Update' : 'Add'} Module
                                </Button>
                            </div> */}
                        </div>
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileModal;