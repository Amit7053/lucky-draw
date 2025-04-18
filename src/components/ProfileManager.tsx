import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCog, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Profile = {
  name: string | null;
  aadhaar_number: string | null;
};

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile>({ name: '', aadhaar_number: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState('');
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
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

  const handleAddMoney = async () => {
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    
    await addMoney(parsedAmount);
    setAmount('');
    setIsAddMoneyOpen(false);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex items-center gap-2">
      <AlertDialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Wallet className="h-4 w-4" />
            ₹{balance.toFixed(2)}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gradient-to-br from-[#232733] to-[#343540] text-white border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Add Money to Wallet</AlertDialogTitle>
            <div className="py-4">
              <div className="mb-4 text-sm text-gray-300">
                Current Balance: ₹{balance.toFixed(2)}
              </div>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                className="mb-4 bg-white/10 border-white/20 text-white"
              />
              <Button onClick={handleAddMoney} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Money
              </Button>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-white/10 text-white text-xs">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{profile.name || 'Profile'}</span>
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
              <div className="space-y-2">
                <Button onClick={() => setIsEditing(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                  Edit Profile
                </Button>
                <Button onClick={handleSignOut} variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
