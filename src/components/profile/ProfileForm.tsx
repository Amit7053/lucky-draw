
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from 'lucide-react';
import type { Profile } from "@/types/profile";

interface ProfileFormProps {
  profile: Profile;
  isEditing: boolean;
  onProfileChange: (updates: Partial<Profile>) => void;
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'aadhaar') => void;
}

export function ProfileForm({ 
  profile, 
  isEditing, 
  onProfileChange, 
  onSave, 
  onCancel,
  onImageUpload 
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
          className="bg-white/10 border-yellow-400/50 text-white focus:border-yellow-400"
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
          className="bg-white/10 border-yellow-400/50 text-white focus:border-yellow-400"
          placeholder="Enter your Aadhaar number"
        />
        {isEditing && (
          <div className="mt-2">
            <Label className="text-yellow-400">Upload Aadhaar Card Image</Label>
            <label className="flex items-center gap-2 p-2 mt-1 border border-yellow-400/50 rounded cursor-pointer hover:bg-yellow-400/10">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onImageUpload(e, 'aadhaar')}
              />
              <Upload className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">
                {profile.aadhaar_image ? 'Change Aadhaar Image' : 'Upload Aadhaar Image'}
              </span>
            </label>
          </div>
        )}
      </div>
      {isEditing && (
        <div className="flex gap-2">
          <Button onClick={onSave} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-purple-900 font-bold">
            Save Changes
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10">
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
