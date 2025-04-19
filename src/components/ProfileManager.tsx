
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { LogOut, Shield } from 'lucide-react';

type Profile = {
  name: string | null;
  aadhaar_number: string | null;
};

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile>({ name: '', aadhaar_number: '' });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { balance, addMoney } = useWallet();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('name, aadhaar_number')
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

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        aadhaar_number: profile.aadhaar_number
      })
      .eq('id', session.user.id);

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

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="p-0 h-12 w-12 rounded-full relative group">
            <Avatar className="h-12 w-12 transform transition-all duration-200 group-hover:scale-110">
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-700 text-white border-2 border-yellow-400">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
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
              <Avatar className="h-24 w-24 transform hover:scale-105 transition-all duration-200">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-700 text-white text-2xl border-4 border-yellow-400">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
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
                <Button onClick={handleSignOut} variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
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
