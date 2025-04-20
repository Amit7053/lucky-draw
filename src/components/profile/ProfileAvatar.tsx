
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/profile";

interface ProfileAvatarProps {
  profile: Profile;
  size?: 'sm' | 'lg';
}

export function ProfileAvatar({ profile, size = 'sm' }: ProfileAvatarProps) {
  const dimensions = size === 'sm' ? 'h-12 w-12' : 'h-24 w-24';
  
  return (
    <div className="relative group">
      <Avatar className={`${dimensions} border-2 border-yellow-400 bg-purple-600`}>
        <AvatarImage 
          src={profile.profile_image ? `https://vjkprdnocgjyxsbkvaad.supabase.co/storage/v1/object/public/user_documents/${profile.profile_image}` : undefined}
          alt="Profile"
        />
        <AvatarFallback className="bg-purple-600 text-white text-xl">
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      {size === 'sm' && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
          <Shield className="w-3 h-3 text-yellow-700" />
        </div>
      )}
    </div>
  );
}

export function ProfileAvatarButton({ profile }: { profile: Profile }) {
  return (
    <Button variant="ghost" className="p-0 h-12 w-12 rounded-full relative group hover:bg-gray-800/50">
      <ProfileAvatar profile={profile} />
    </Button>
  );
}
