import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Settings, Music, Zap, Bell } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Slider } from './slider';
import { Switch } from './switch';
import { useUserProfileStore } from '../../store/userProfileStore';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { cn } from '../../lib/utils';

interface AudioControlsProps {
  className?: string;
  compact?: boolean;
  showAdvanced?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  className,
  compact = false,
  showAdvanced = false
}) => {
  const { profile, updateProfile } = useUserProfileStore();
  const { playSound, stopAllSounds } = useSoundEffects();
  const [showSettings, setShowSettings] = useState(showAdvanced);

  const soundEnabled = profile?.settings?.soundEnabled ?? true;
  const masterVolume = profile?.settings?.masterVolume ?? 0.7;
  const soundEffectsVolume = profile?.settings?.soundEffectsVolume ?? 0.8;
  const musicVolume = profile?.settings?.musicVolume ?? 0.5;
  const notificationsVolume = profile?.settings?.notificationsVolume ?? 0.6;

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    updateProfile({
      settings: {
        soundEnabled: newSoundEnabled,
        musicEnabled: profile?.settings?.musicEnabled ?? true,
        masterVolume: profile?.settings?.masterVolume ?? 0.7,
        soundEffectsVolume: profile?.settings?.soundEffectsVolume ?? 0.8,
        musicVolume: profile?.settings?.musicVolume ?? 0.5,
        notificationsVolume: profile?.settings?.notificationsVolume ?? 0.6,
        notificationsEnabled: profile?.settings?.notificationsEnabled ?? true,
        autoAcceptFriendRequests: profile?.settings?.autoAcceptFriendRequests ?? false,
        showOnlineStatus: profile?.settings?.showOnlineStatus ?? true,
        allowSpectators: profile?.settings?.allowSpectators ?? true,
        preferredGameMode: profile?.settings?.preferredGameMode ?? 'classic',
        language: profile?.settings?.language ?? 'en',
        theme: profile?.settings?.theme ?? 'auto'
      }
    });

    if (!newSoundEnabled) {
      stopAllSounds();
    } else {
      // Play a test sound when enabling
      playSound('button-click');
    }
  };

  const updateVolume = (type: string, value: number) => {
    updateProfile({
      settings: {
        soundEnabled: profile?.settings?.soundEnabled ?? true,
        musicEnabled: profile?.settings?.musicEnabled ?? true,
        masterVolume: profile?.settings?.masterVolume ?? 0.7,
        soundEffectsVolume: profile?.settings?.soundEffectsVolume ?? 0.8,
        musicVolume: profile?.settings?.musicVolume ?? 0.5,
        notificationsVolume: profile?.settings?.notificationsVolume ?? 0.6,
        notificationsEnabled: profile?.settings?.notificationsEnabled ?? true,
        autoAcceptFriendRequests: profile?.settings?.autoAcceptFriendRequests ?? false,
        showOnlineStatus: profile?.settings?.showOnlineStatus ?? true,
        allowSpectators: profile?.settings?.allowSpectators ?? true,
        preferredGameMode: profile?.settings?.preferredGameMode ?? 'classic',
        language: profile?.settings?.language ?? 'en',
        theme: profile?.settings?.theme ?? 'auto',
        [`${type}Volume`]: value
      }
    });
  };

  const testSound = (soundType: string) => {
    switch (soundType) {
      case 'dice':
        playSound('dice-roll-sequence');
        break;
      case 'token':
        playSound('token-move');
        break;
      case 'capture':
        playSound('token-capture');
        break;
      case 'victory':
        playSound('victory-celebration');
        break;
      case 'notification':
        playSound('turn-notification');
        break;
      default:
        playSound('button-click');
    }
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSound}
          className={cn(
            "p-2 transition-colors",
            soundEnabled ? "text-green-600 hover:text-green-700" : "text-red-500 hover:text-red-600"
          )}
          title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>

        {showAdvanced && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2"
            title="Audio settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Audio Settings
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Master Audio Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="font-medium">Sound Effects</span>
          </div>
          <Switch
            checked={soundEnabled}
            onCheckedChange={toggleSound}
          />
        </div>

        {soundEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Master Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Master Volume</label>
                <span className="text-xs text-gray-500">{Math.round(masterVolume * 100)}%</span>
              </div>
              <Slider
                value={[masterVolume]}
                onValueChange={(value) => updateVolume('master', value[0])}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-2 border-t"
              >
                {/* Sound Effects Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      <label className="text-sm">Sound Effects</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{Math.round(soundEffectsVolume * 100)}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testSound('dice')}
                        className="p-1 h-6 w-6"
                        title="Test dice sound"
                      >
                        🎲
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[soundEffectsVolume]}
                    onValueChange={(value) => updateVolume('soundEffects', value[0])}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Music Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music className="w-3 h-3" />
                      <label className="text-sm">Background Music</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{Math.round(musicVolume * 100)}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testSound('victory')}
                        className="p-1 h-6 w-6"
                        title="Test victory sound"
                      >
                        🎵
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[musicVolume]}
                    onValueChange={(value) => updateVolume('music', value[0])}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Notifications Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-3 h-3" />
                      <label className="text-sm">Notifications</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{Math.round(notificationsVolume * 100)}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testSound('notification')}
                        className="p-1 h-6 w-6"
                        title="Test notification sound"
                      >
                        🔔
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[notificationsVolume]}
                    onValueChange={(value) => updateVolume('notifications', value[0])}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Test Sounds */}
                <div className="pt-2 border-t">
                  <label className="text-sm font-medium mb-2 block">Test Sounds</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testSound('token')}
                      className="text-xs"
                    >
                      Token Move
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testSound('capture')}
                      className="text-xs"
                    >
                      Capture
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioControls;
