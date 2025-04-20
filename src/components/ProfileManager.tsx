
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { Shield, LogOut, Upload } from 'lucide-react';

type Profile = {
  name: string | null;
  aadhaar_number: string | null;
  profile_image: string | null;
  aadhaar_image: string | null;
};

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

    // Update the profile in the database with the new image path
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
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="p-0 h-12 w-12 rounded-full relative group bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20">
            <Avatar className="h-12 w-12 transform transition-all duration-200 group-hover:scale-110">
              <AvatarImage src={profile.profile_image ? `https://vjkprdnocgjyxsbkvaad.supabase.co/storage/v1/object/public/user_documents/${profile.profile_image}` : undefined} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-700 text-white border-2 border-yellow-400">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-3 h-3 text-purple-700" />
            </div>
          </Button>
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
                <Avatar className="h-24 w-24 transform group-hover:scale-105 transition-all duration-200 border-4 border-yellow-400/50 group-hover:border-yellow-400">
                  <AvatarImage src={profile.profile_image ? `https://vjkprdnocgjyxsbkvaad.supabase.co/storage/v1/object/public/user_documents/${profile.profile_image}` : undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-700 text-white text-2xl">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 p-1 bg-yellow-400 rounded-full cursor-pointer transform transition-transform hover:scale-110 shadow-lg">
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
            <div className="space-y-2">
              <Label className="text-yellow-400">Player Name</Label>
              <Input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
                onChange={(e) => setProfile({ ...profile, aadhaar_number: e.target.value })}
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
                      onChange={(e) => handleImageUpload(e, 'aadhaar')}
                    />
                    <Upload className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400">
                      {profile.aadhaar_image ? 'Change Aadhaar Image' : 'Upload Aadhaar Image'}
                    </span>
                  </label>
                </div>
              )}
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-purple-900 font-bold">
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10">
                  Cancel
                </Button>
              </div>
            ) : (
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
