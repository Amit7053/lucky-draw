import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Shield, Upload } from 'lucide-react';
import { ProfileAvatar, ProfileAvatarButton } from './profile/ProfileAvatar';
import { ProfileForm } from './profile/ProfileForm';
import type { Profile } from "@/types/profile";

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile>({ 
    name: '', 
    aadhaar_number: '', 
    profile_image: null,
    aadhaar_image: null 
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('name, aadhaar_number, profile_image, aadhaar_image')
      .eq('id', session.user.id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setProfile(data);
    }
  };

  const uploadFile = async (file: File, type: 'profile' | 'aadhaar') => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${type}-${Math.random()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('user_documents')
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: "Error",
        description: `Failed to upload ${type} image`,
        variant: "destructive",
      });
      return null;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        [`${type}_image`]: fileName
      })
      .eq('id', user.id);

    if (updateError) {
      toast({
        title: "Error",
        description: `Failed to update profile with ${type} image`,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Success",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully`,
    });

    return fileName;
  };

  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        aadhaar_number: profile.aadhaar_number,
        profile_image: profile.profile_image,
        aadhaar_image: profile.aadhaar_image
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'aadhaar') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = await uploadFile(file, type);
    if (fileName) {
      setProfile(prev => ({
        ...prev,
        [type === 'profile' ? 'profile_image' : 'aadhaar_image']: fileName
      }));
      
      fetchProfile();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <ProfileAvatarButton profile={profile} />
        </SheetTrigger>
        <SheetContent className="bg-gradient-to-br from-[#1A1F2C] to-[#403E43] text-white border-white/10">
          <SheetHeader>
            <SheetTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              Player Profile
            </SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="flex justify-center">
              <div className="relative group">
                <ProfileAvatar profile={profile} size="lg" />
                <label className="absolute bottom-0 right-0 p-1 bg-purple-400 rounded-full cursor-pointer transform transition-transform hover:scale-110 shadow-lg">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                  />
                  <Upload className="w-4 h-4 text-purple-700" />
                </label>
              </div>
            </div>
            
            <ProfileForm 
              profile={profile}
              isEditing={isEditing}
              onProfileChange={(updates) => setProfile(prev => ({ ...prev, ...updates }))}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              onImageUpload={handleImageUpload}
            />

            {!isEditing && (
              <div className="space-y-2">
                <Button onClick={() => setIsEditing(true)} className="w-full bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 text-white">
                  Edit Profile
                </Button>
                <Button onClick={signOut} variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
