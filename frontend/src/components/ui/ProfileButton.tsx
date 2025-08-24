import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut } from 'lucide-react';

interface ProfileButtonProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onClick?: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ user, onLogout, onClick }) => {
  if (!user) {
    return null;
  }

  const initials = user.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 rounded-full p-0 hover:bg-gray-800 transition-colors"
        onClick={onClick}
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.avatar} alt={user.name || user.email} />
          <AvatarFallback className="bg-orange-500 text-white font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Button>
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 top-12 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-3 border-b border-gray-700">
          <div className="text-white font-medium text-sm">{user.name || 'User'}</div>
          <div className="text-gray-400 text-xs">{user.email}</div>
        </div>
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileButton;

