import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Member } from '../redux/slices/membersSlice';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { Clock, CheckSquare, Activity } from 'lucide-react';

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const { tasks } = useSelector((state: RootState) => state.members);
  const memberTasks = tasks.filter(t => t.assignedTo === member.id);
  const completedTasks = memberTasks.filter(t => t.completed);
  const avgProgress = memberTasks.length ? memberTasks.reduce((sum, task) => sum + task.progress, 0) / memberTasks.length : 0;

  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'Working': return 'status-working';
      case 'Break': return 'status-break';
      case 'Meeting': return 'status-meeting';
      case 'Offline': return 'status-offline';
      default: return 'status-offline';
    }
  };

  const getStatusIcon = (status: Member['status']) => {
    switch (status) {
      case 'Working': return '💼';
      case 'Break': return '☕';
      case 'Meeting': return '🤝';
      case 'Offline': return '💤';
      default: return '❓';
    }
  };

  return (
    <div className="hover-lift">
      <Card className="status-card overflow-hidden">
        <CardContent className="p-6">
          {/* Member Header */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-3xl">{member.avatar}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">{member.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm">{getStatusIcon(member.status)}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getStatusColor(member.status)}`}
                >
                  {member.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                Last active {formatDistanceToNow(new Date(member.lastActive), { addSuffix: true })}
              </span>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              member.status === 'Offline' ? 'bg-muted' : 'bg-indian-green'
            }`} />
          </div>

          {/* Task Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Tasks</span>
              </div>
              <span className="font-semibold text-foreground">
                {completedTasks.length}/{memberTasks.length}
              </span>
            </div>
            
            {memberTasks.length > 0 && (
              <>
                <Progress 
                  value={(completedTasks.length / memberTasks.length) * 100} 
                  className="h-2"
                />
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">Avg Progress</span>
                  </div>
                  <span className="font-semibold text-accent">{Math.round(avgProgress)}%</span>
                </div>
              </>
            )}

            {memberTasks.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground italic">No tasks assigned</p>
              </div>
            )}
          </div>

          {/* Active Tasks Preview */}
          {memberTasks.filter(t => !t.completed).length > 0 && (
            <div className="mt-4 p-3 bg-muted/30 rounded-xl">
              <p className="text-xs font-medium text-muted-foreground mb-2">Current Tasks</p>
              <div className="space-y-1">
                {memberTasks.filter(t => !t.completed).slice(0, 2).map(task => (
                  <div key={task.id} className="text-xs text-foreground">
                    • {task.title}
                  </div>
                ))}
                {memberTasks.filter(t => !t.completed).length > 2 && (
                  <div className="text-xs text-primary">
                    +{memberTasks.filter(t => !t.completed).length - 2} more...
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberCard;