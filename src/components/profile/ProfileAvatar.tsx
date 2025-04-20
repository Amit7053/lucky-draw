
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
  const borderStyle = size === 'sm' ? 'border-2' : 'border-4';
  
  return (
    <div className="relative group">
      <Avatar className={`${dimensions} transform transition-all duration-200 ${size === 'sm' ? 'group-hover:scale-110' : 'group-hover:scale-105'} ${size === 'lg' ? 'border-4 border-purple-400/50 group-hover:border-purple-400' : ''}`}>
        <AvatarImage 
          src={profile.profile_image ? `https://vjkprdnocgjyxsbkvaad.supabase.co/storage/v1/object/public/user_documents/${profile.profile_image}` : undefined}
          alt="Profile"
        />
        <AvatarFallback className={`bg-gradient-to-br from-purple-600 to-blue-700 text-white ${borderStyle} border-purple-400 ${size === 'lg' ? 'text-2xl' : ''}`}>
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      {size === 'sm' && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
          <Shield className="w-3 h-3 text-purple-700" />
        </div>
      )}
    </div>
  );
}

export function ProfileAvatarButton({ profile }: { profile: Profile }) {
  return (
    <Button variant="ghost" className="p-0 h-12 w-12 rounded-full relative group bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20">
      <ProfileAvatar profile={profile} />
    </Button>
  );
}
