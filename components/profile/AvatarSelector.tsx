import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, User, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  getFreeAvatarsByGender, 
  getAvatarsByGender, 
  getAvatarConfig,
  AvatarConfig 
} from '../../constants/cosmetics';
import { useUserProfileStore } from '../../store/userProfileStore';
import { cn } from '../../lib/utils';

interface AvatarSelectorProps {
  onAvatarSelect?: (avatarId: string) => void;
  showOnlyFree?: boolean;
  selectedAvatarId?: string;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ 
  onAvatarSelect, 
  showOnlyFree = false,
  selectedAvatarId 
}) => {
  const { profile, updateProfile } = useUserProfileStore();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all');
  const [localSelectedAvatar, setLocalSelectedAvatar] = useState<string>(
    selectedAvatarId || profile?.equippedCosmetics?.avatar || 'default'
  );

  const getAvatarsToShow = (): AvatarConfig[] => {
    if (selectedGender === 'all') {
      return showOnlyFree 
        ? getFreeAvatarsByGender('male').concat(getFreeAvatarsByGender('female')).concat(getFreeAvatarsByGender('neutral'))
        : getAvatarsByGender('male').concat(getAvatarsByGender('female')).concat(getAvatarsByGender('neutral'));
    }
    
    return showOnlyFree 
      ? getFreeAvatarsByGender(selectedGender)
      : getAvatarsByGender(selectedGender);
  };

  const handleAvatarSelect = (avatarId: string) => {
    setLocalSelectedAvatar(avatarId);
    
    if (onAvatarSelect) {
      onAvatarSelect(avatarId);
    } else {
      // Update user profile directly
      updateProfile({
        equippedCosmetics: {
          ...profile?.equippedCosmetics,
          avatar: avatarId
        }
      });
    }
  };

  const avatarsToShow = getAvatarsToShow();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Choose Your Avatar
        </CardTitle>
        <p className="text-sm text-gray-600">
          {showOnlyFree ? 'Select from available free avatars' : 'Choose your character avatar'}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gender Filter */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={selectedGender === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGender('all')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            All
          </Button>
          <Button
            variant={selectedGender === 'male' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGender('male')}
          >
            👨 Male
          </Button>
          <Button
            variant={selectedGender === 'female' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGender('female')}
          >
            👩 Female
          </Button>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {avatarsToShow.map((avatar) => {
            const isSelected = localSelectedAvatar === avatar.id;
            const isOwned = profile?.ownedCosmetics?.includes(avatar.id) || avatar.isFree;
            
            return (
              <motion.div
                key={avatar.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <button
                  onClick={() => isOwned && handleAvatarSelect(avatar.id)}
                  disabled={!isOwned}
                  className={cn(
                    "w-full aspect-square rounded-xl border-2 p-4 transition-all duration-200",
                    "flex flex-col items-center justify-center gap-2",
                    avatar.backgroundColor,
                    isSelected 
                      ? "border-purple-500 ring-2 ring-purple-500 ring-offset-2" 
                      : avatar.borderColor,
                    isOwned 
                      ? "hover:shadow-lg cursor-pointer" 
                      : "opacity-50 cursor-not-allowed grayscale",
                    !isOwned && "relative"
                  )}
                >
                  {/* Avatar Emoji */}
                  <div className="text-2xl sm:text-3xl">
                    {avatar.emoji}
                  </div>
                  
                  {/* Avatar Name */}
                  <div className="text-xs font-medium text-center text-white drop-shadow-md">
                    {avatar.name}
                  </div>

                  {/* Free Badge */}
                  {avatar.isFree && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      FREE
                    </div>
                  )}

                  {/* Selected Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -left-2 bg-purple-500 text-white rounded-full p-1"
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  )}

                  {/* Locked Overlay */}
                  {!isOwned && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                      <div className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded">
                        LOCKED
                      </div>
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Avatar Info */}
        {localSelectedAvatar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="text-3xl">
                {getAvatarConfig(localSelectedAvatar).emoji}
              </div>
              <div>
                <h3 className="font-semibold">
                  {getAvatarConfig(localSelectedAvatar).name}
                </h3>
                <p className="text-sm text-gray-600">
                  Selected Avatar
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvatarSelector;
