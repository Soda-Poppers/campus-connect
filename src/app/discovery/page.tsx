"use client"
import React, { useState, useEffect } from 'react';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import {
    Search,
    Filter,
    Grid3X3,
    List,
    MessageCircle,
    Eye,
    X,
    ChevronDown
} from 'lucide-react';

import { api } from '~/trpc/react';
import { Course } from '@prisma/client';
import type { Skill } from '~/types/skills';
import { useRouter } from 'next/navigation';

type Filters = {
    name: string,
    course?: Course,
    modules: string[]
}

type ModuleFilter = {
    modId: string
}

type Users = {
    id: string; // Assuming 'id' is a string in your database schema
    name: string;
    course: string;
    image: string;
    enrollmentYear: number; // Assuming 'enrollmentYear' is a number
    hardSkills: Skill[]; // Assuming 'hardSkills' is an array of strings
    softSkills: Skill[]; // Assuming 'softSkills' is an array of strings
    Modules: {
        module: {
            classId: string; // Assuming 'classId' is a string
        };
    }[];
}

const courseOptions = Object.entries(Course).map(([key, value]) => ({
    value: key,
    label: value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
}));

// Removed the useRouter call here

const DiscoveryPage = () => {
    const router = useRouter(); // Moved useRouter inside the component
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [activeFilters, setActiveFilters] = useState<ModuleFilter[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(''); // New state for debounced query
    const [showFilters, setShowFilters] = useState(false);
    const [modules, setModules] = useState([]);
    const [moduleOptions, setModuleOptions] = useState<string[]>([]);
    const [courseFilter, setCourseFilter] = useState<string>('all-courses');
    const [users, setUsers] = useState<Users[]>([]);

    const allMods = api.module.getAllModulesClassId.useQuery();
    const getAllUserByFilter = api.user.getAllUsersByFilter.useQuery({
        filters: {
            name: debouncedSearchQuery, // Use debounced query here
            course: courseFilter !== 'all-courses' ? (courseFilter as Course | undefined) : undefined,
            modules: modules.length > 0 ? modules : undefined,
        },
    });

    // Custom debounce logic for search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300); // Adjust debounce delay as needed (e.g., 300ms)

        return () => {
            clearTimeout(handler); // Cleanup timeout on unmount or query change
        };
    }, [searchQuery]);

    useEffect(() => {
        console.log(allMods.data)
        if (allMods.data) {
            const options = allMods.data.map(module => module.classId) // Adjust based on your data structure
            setModuleOptions(options);
        }
    }, [allMods.data]);

    useEffect(() => {
        if (getAllUserByFilter.data) {
            const mappedUsers = getAllUserByFilter.data.map(user => ({
                id: user.id,
                name: user.name || '',
                course: user.course || '',
                enrollmentYear: user.enrollmentYear || 2000,
                hardSkills: user.hardSkills as Skill[],
                softSkills: user.softSkills as Skill[],
                image: user.image || '',
                Modules: user.Modules,
            }));
            setUsers(mappedUsers);
        }
    }, [getAllUserByFilter.data]);

    // filter by module arr
    const toggleFilter = (filter: ModuleFilter) => {
        setActiveFilters(prev => {
            const exists = prev.find(f => f.modId === filter.modId);
            if (exists) {
                return prev.filter(f => f.modId !== filter.modId);
            } else {
                return [...prev, filter];
            }
        });
    };

    const clearAllFilters = () => {
        setActiveFilters([]);
        setCourseFilter('all-courses');
    };

    const handleCourseChange = (value: string) => {
        setCourseFilter(value);
    };

    const filteredUsers = users.filter(user => {
        // Search query filter
        if (debouncedSearchQuery) { // Use debounced query here
            const query = debouncedSearchQuery.toLowerCase();
            const matchesSearch =
                user.name.toLowerCase().includes(query) ||
                user.course.toLowerCase().includes(query) ||
                user.Modules.some(module => module.module.classId.toLowerCase().includes(query));
            if (!matchesSearch) return false;
        }

        // Degree filter  
        if (courseFilter && courseFilter !== 'all-courses' && user.course !== courseFilter) return false;

        // Tag filters
        if (activeFilters.length === 0) return true;

        return activeFilters.some(filter => {
            return (
                user.Modules.some(module => module.module.classId === filter.modId)
            );
        });
    });



    const UserCard = ({ user }: { user: Users }) => {
        if (viewMode === 'list') {
            return (
                <Card className="p-5 hover:shadow-lg transition-all duration-200 border border-border/50 card-animate">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-14 h-14 border-2 border-primary/20">
                            {/* <AvatarImage src={user.image} /> */}
                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-medium">
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-primary truncate text-lg">{user.name}</h3>
                            <p className="text-muted-foreground mb-2">{user.course.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase())} • {user.enrollmentYear}</p>
                            <div className="flex flex-wrap gap-2">
                                {user.hardSkills?.slice(0, 2).map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                                        {skill.skillName ?? ''}
                                    </Badge>
                                ))}
                                {user.softSkills?.slice(0, 1).map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                                        {skill.skillName ?? ''}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Button variant="outline" size="sm" className="mobile-button">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                            </Button>
                        </div>
                    </div>
                </Card>
            );
        }

        const navigateUser = (userId: string) => {
            router.push(`/profile/${userId}/view`);
        };

        return (
            <Card className="p-5 hover:shadow-lg transition-all duration-200 border border-border/50 card-animate ">
                <div className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-primary/20">
                    <AvatarImage src={user.image} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-medium text-lg">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>

                    <h3 className="font-medium text-primary mb-1 text-lg">{user.name}</h3>
                    <p className="text-muted-foreground mb-3 text-sm">Enrolled in {user.enrollmentYear}</p>
                    <Badge variant="default" className="text-xs px-3 py-1 mb-3">
                        {user.course.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                    </Badge>



                    <div className="flex flex-wrap gap-2 justify-center mb-5">
                        {user.hardSkills?.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-3 py-1">
                                {skill.skillName}
                            </Badge>
                        ))}
                        {user.softSkills?.slice(0, 1).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-3 py-1">
                                {skill.skillName}
                            </Badge>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full mobile-button" onClick={()=>navigateUser(user.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                        </Button>
                      
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="h-full overflow-y-auto safe-area-top touch-scroll container mx-auto">
            <div className="px-18 py-14 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary">Discover Students</h1>
                    <div className="flex space-x-2">
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="mobile-button"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className="mobile-button"
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                        placeholder="Search by name, skills, modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 mobile-form-input"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 mobile-button"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className={`w-5 h-5 ${showFilters || activeFilters.length > 0 ? 'text-primary' : ''}`} />
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </Button>
                </div>

                {/* Quick Filters */}
                <div className="gap-4">

                    <Select value={courseFilter} onValueChange={handleCourseChange}>
                        <SelectTrigger className="h-12 mobile-form-input">
                            <SelectValue placeholder="Filter by degree" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-courses">All Courses</SelectItem>
                            {courseOptions.map(course => (
                                <SelectItem key={course.label} value={course.value}>{course.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <Card className="p-6 space-y-6 border-primary/20 card-animate">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-primary text-lg">Advanced Filters</h3>
                            <div className="flex space-x-3">
                                {(activeFilters.length > 0 || courseFilter !== 'all-courses') && (
                                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="mobile-button">
                                        Clear All
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="mobile-button">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        
                        {moduleOptions.map((option) => {
                            const filterObj = { modId: option };
                            const isActive = activeFilters.find(f => f.modId === option);
                            return (
                                <Button
                                    key={option}
                                    variant={isActive ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => toggleFilter(filterObj)}
                                    className="text-sm mobile-button"
                                >
                                    {option}
                                </Button>
                            );
                        })}
                    </Card>
                )}

                {/* Active Filters Display */}
                {activeFilters.length > 0 && !showFilters && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-muted-foreground self-center">Filters:</span>
                        {activeFilters.map((filter, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="cursor-pointer px-3 py-1"
                                onClick={() => toggleFilter(filter)}
                            >
                                {filter.modId} ×
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Results Count */}
                <div className="text-muted-foreground">
                    <span className="font-medium">{filteredUsers.length}</span> student{filteredUsers.length !== 1 ? 's' : ''} found
                </div>

                {/* User Grid/List */}
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-3 gap-5'
                        : 'space-y-4'
                }>
                    {filteredUsers.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-primary mb-3 text-lg">No students found</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                            Try adjusting your search terms or filters to find more students
                        </p>
                        <Button variant="outline" onClick={clearAllFilters} className="mobile-button">
                            Clear All Filters
                        </Button>
                    </div>
                )}

                {/* Bottom Spacing for Navigation */}
                <div className="h-24"></div>
            </div>
        </div>
    );
};

export default DiscoveryPage;