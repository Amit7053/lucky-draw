
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserCog } from 'lucide-react';

type Profile = {
  name: string | null;
  aadhaar_number: string | null;
};

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile>({ name: '', aadhaar_number: '' });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
          <UserCog className="h-4 w-4" />
          Profile
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gradient-to-br from-[#232733] to-[#343540] text-white border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white">Account Management</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-white/90">Name</Label>
            <Input
              type="text"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/90">Aadhaar Number</Label>
            <Input
              type="text"
              value={profile.aadhaar_number || ''}
              onChange={(e) => setProfile({ ...profile, aadhaar_number: e.target.value })}
              disabled={!isEditing}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter your Aadhaar number"
            />
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full bg-blue-600 hover:bg-blue-700">
              Edit Profile
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
