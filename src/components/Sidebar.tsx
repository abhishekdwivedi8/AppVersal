import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  BarChart3, 
  Users, 
  CheckSquare, 
  Settings, 
  Activity,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const { currentRole } = useSelector((state: RootState) => state.role);
  const { members, tasks } = useSelector((state: RootState) => state.members);

  const leadMenuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, count: null },
    { id: 'members', label: 'Team Members', icon: Users, count: members.length },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare, count: tasks.length },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, count: null },
  ];

  const memberMenuItems = [
    { id: 'status', label: 'My Status', icon: Activity, count: null },
    { id: 'mytasks', label: 'My Tasks', icon: Target, count: tasks.filter(t => t.assignedTo === 1).length },
    { id: 'timetrack', label: 'Time Tracking', icon: Clock, count: null },
  ];

  const menuItems = currentRole === 'Team Lead' ? leadMenuItems : memberMenuItems;
  const activeMembers = members.filter(m => m.status !== 'Offline').length;

  return (
    <aside className="w-72 bg-gradient-to-b from-background to-secondary border-r border-border shadow-sm">
      <div className="p-6 h-full">
        {/* Role Badge */}
        <div className="mb-8">
          <Badge 
            variant="secondary" 
            className="btn-primary text-sm px-4 py-2 w-full justify-center"
          >
            {currentRole} View
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="status-card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{activeMembers}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="status-card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{tasks.filter(t => !t.completed).length}</p>
              <p className="text-xs text-muted-foreground">Active Tasks</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-left p-4 rounded-xl transition-all duration-200 ${
                activeSection === item.id 
                  ? 'sidebar-active' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.count !== null && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 bg-primary/20 text-primary text-xs"
                >
                  {item.count}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        {/* Bottom Stats */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="status-card p-4 text-center">
            <div className="text-sm text-muted-foreground mb-2">Team Activity</div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                style={{ width: `${(activeMembers / members.length) * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round((activeMembers / members.length) * 100)}% Team Active
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;