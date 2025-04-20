
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, LogOut } from 'lucide-react';
import type { Profile } from "@/types/profile";

interface ProfileFormProps {
  profile: Profile;
  isEditing: boolean;
  onProfileChange: (updates: Partial<Profile>) => void;
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'aadhaar') => void;
  onEditToggle: () => void;
}

export function ProfileForm({ 
  profile, 
  isEditing, 
  onProfileChange, 
  onSave, 
  onCancel,
  onImageUpload,
  onEditToggle
}: ProfileFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-yellow-400">Player Name</Label>
        <Input
          type="text"
          value={profile.name || ''}
          onChange={(e) => onProfileChange({ name: e.target.value })}
          disabled={!isEditing}
          className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-400 placeholder:text-gray-500"
          placeholder="Enter your name"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-yellow-400">Aadhaar Number</Label>
        <Input
          type="text"
          value={profile.aadhaar_number || ''}
          onChange={(e) => onProfileChange({ aadhaar_number: e.target.value })}
          disabled={!isEditing}
          className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-400 placeholder:text-gray-500"
          placeholder="Enter your Aadhaar number"
        />
      </div>
      
      {isEditing ? (
        <div className="flex gap-2">
          <Button onClick={onSave} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            Save Changes
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
            Cancel
          </Button>
        </div>
      ) : (
        <Button 
          onClick={onEditToggle} 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          Edit Profile
        </Button>
      )}
    </div>
  );
}
