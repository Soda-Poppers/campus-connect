/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { useState, useCallback, useEffect } from "react";
import type { SocialMedia } from "~/types/socialMedia";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

interface SkillInputProps {
    label: string;
    socialMedias: SocialMedia[];
    onChange: (newSocialMedia: SocialMedia[]) => void;
    placeholder?: string;
}

const SocialMediaInput: React.FC<SkillInputProps> = ({
    label,
    socialMedias,
    onChange,
}) => {

    const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])

    useEffect(() => {
        setSocialMedia(
            socialMedias.map((social) => ({
                platform: social.platform,
                username: social.username,
            }))
        );
    }, [socialMedias]);


    const handleSocialChange = useCallback((platform: string, value: string) => {
        const updatedSocialMedia = socialMedia.map((social) =>
            social.platform === platform ? { ...social, username: value } : social
        );

        const updatedSocialMedias: SocialMedia[] = updatedSocialMedia.map((social) => ({
            platform: social.platform,
            username: social.username,
        }));

        setSocialMedia(updatedSocialMedia);
        onChange(updatedSocialMedias);
    }, [socialMedia, onChange]);


    useEffect(() => {
        console.log("social Medias", socialMedias)
        console.log("social Media", socialMedia)
    })

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium">{label} (optional)</label>
            <div className="space-y-2">
                <div className="space-y-3">

                    <div>
                        <Label htmlFor="edit-telegram">Telegram</Label>
                        <Input
                            id="edit-telegram"
                            value={socialMedia.find(social => social.platform === 'telegram')?.username || ''}
                            onChange={(e) => handleSocialChange('telegram', e.target.value)}
                            placeholder="@username"
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-instagram">Instagram</Label>
                        <Input
                            id="edit-instagram"
                            value={socialMedia.find(social => social.platform === 'instagram')?.username || ''}
                            onChange={(e) => handleSocialChange('instagram', e.target.value)}
                            placeholder="@username"
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-linkedin">LinkedIn</Label>
                        <Input
                            id="edit-linkedin"
                            value={socialMedia.find(social => social.platform === 'linkedin')?.username || ''}
                            onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                            placeholder="linkedin.com/in/username"
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                            id="edit-email"
                            value={socialMedia.find(social => social.platform === 'email')?.username || ''}
                            onChange={(e) => handleSocialChange('email', e.target.value)}
                            placeholder="your.email@smu.edu.sg"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SocialMediaInput;
