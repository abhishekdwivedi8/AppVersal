import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchRole } from '../redux/slices/roleSlice';
import { RootState } from '../redux/store';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Users, Settings, Moon, Sun } from 'lucide-react';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { currentRole, currentUser } = useSelector((state: RootState) => state.role);
  const { members } = useSelector((state: RootState) => state.members);
  
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const handleRoleSwitch = () => {
    const newRole = currentRole === 'Team Lead' ? 'Team Member' : 'Team Lead';
    dispatch(switchRole(newRole));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const activeMembers = members.filter(m => m.status !== 'Offline').length;

  return (
    <header className="bg-gradient-to-r from-background to-secondary border-b border-border shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-4 hover-lift">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-sm">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Pulse</h1>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="status-working">
            {activeMembers} Active
          </Badge>
        </div>

        {/* Center - Role Switcher */}
        <div className="flex items-center space-x-4 bg-card rounded-xl px-6 py-3 shadow-sm border border-border hover-lift">
          <span className="text-sm font-medium text-muted-foreground">Role:</span>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-semibold transition-colors ${
              currentRole === 'Team Lead' ? 'text-primary' : 'text-muted-foreground'
            }`}>
              Lead
            </span>
            <Switch 
              checked={currentRole === 'Team Member'} 
              onCheckedChange={handleRoleSwitch}
              className="data-[state=checked]:bg-accent"
            />
            <span className={`text-sm font-semibold transition-colors ${
              currentRole === 'Team Member' ? 'text-accent' : 'text-muted-foreground'
            }`}>
              Member
            </span>
          </div>
        </div>

        {/* Right - User Profile & Settings */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="hover:bg-muted rounded-xl"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <div className="flex items-center space-x-3 bg-card rounded-xl px-4 py-2 shadow-sm border border-border hover-lift">
            <div className="text-2xl">{currentUser.avatar}</div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
              <p className="text-xs text-primary font-medium">{currentRole}</p>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-muted rounded-xl"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;