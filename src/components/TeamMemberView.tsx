import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateMemberStatus } from '../redux/slices/membersSlice';
import { RootState } from '../redux/store';
import StatusSelector from './StatusSelector';
import TaskList from './TaskList';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckSquare, Clock, Target, Activity } from 'lucide-react';

interface TeamMemberViewProps {
  activeSection: string;
}

const TeamMemberView: React.FC<TeamMemberViewProps> = ({ activeSection }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.role);
  const { members, tasks } = useSelector((state: RootState) => state.members);
  
  const currentMember = members.find(m => m.id === currentUser.id);
  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id);
  const completedTasks = myTasks.filter(t => t.completed);
  const avgProgress = myTasks.length ? myTasks.reduce((sum, task) => sum + task.progress, 0) / myTasks.length : 0;

  const handleStatusUpdate = (newStatus: typeof currentMember.status) => {
    dispatch(updateMemberStatus({ memberId: currentUser.id, status: newStatus }));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Working': return 'status-working';
      case 'Break': return 'status-break';
      case 'Meeting': return 'status-meeting';
      case 'Offline': return 'status-offline';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const renderStatus = () => (
    <div className="space-y-8">
      {/* Current Status Card */}
      <Card className="status-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Activity className="w-6 h-6 mr-3 text-primary" />
            My Current Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-2">{currentUser.avatar}</div>
            <h3 className="text-2xl font-bold text-foreground">{currentUser.name}</h3>
            <Badge 
              variant="secondary" 
              className={`mt-2 text-lg px-4 py-2 ${getStatusBadgeClass(currentMember?.status)}`}
            >
              {currentMember?.status || 'Unknown'}
            </Badge>
          </div>
          
          <StatusSelector 
            currentStatus={currentMember?.status} 
            onStatusChange={handleStatusUpdate} 
          />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="hover-lift">
          <Card className="status-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Tasks</p>
                  <p className="text-3xl font-bold text-primary">{myTasks.length}</p>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="hover-lift">
          <Card className="status-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-indian-green">{completedTasks.length}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-indian-green" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="hover-lift">
          <Card className="status-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                  <p className="text-3xl font-bold text-accent">{Math.round(avgProgress)}%</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                  <span className="text-white text-sm font-bold">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="status-card hover-lift">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Task Completion Rate</span>
              <span className="font-semibold">{myTasks.length ? Math.round((completedTasks.length / myTasks.length) * 100) : 0}%</span>
            </div>
            <Progress 
              value={myTasks.length ? (completedTasks.length / myTasks.length) * 100 : 0} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMyTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">My Tasks</h2>
        <Badge variant="secondary" className="status-working">
          {myTasks.filter(t => !t.completed).length} Active
        </Badge>
      </div>
      
      <TaskList memberView={true} />
    </div>
  );

  const renderTimeTracking = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Time Tracking</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="status-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                <span className="text-sm text-muted-foreground">Working Time</span>
                <span className="font-semibold text-indian-green">5h 32m</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                <span className="text-sm text-muted-foreground">Break Time</span>
                <span className="font-semibold text-saffron">45m</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                <span className="text-sm text-muted-foreground">Meeting Time</span>
                <span className="font-semibold text-indian-blue">1h 15m</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="status-card hover-lift">
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Time tracking features coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'status': return renderStatus();
      case 'mytasks': return renderMyTasks();
      case 'timetrack': return renderTimeTracking();
      default: return renderStatus();
    }
  };

  return <div className="space-y-6">{renderSection()}</div>;
};

export default TeamMemberView;