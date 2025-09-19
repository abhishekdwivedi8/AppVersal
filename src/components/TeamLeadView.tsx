import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import MemberCard from './MemberCard';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Users, CheckSquare, Clock, TrendingUp, Plus } from 'lucide-react';

interface TeamLeadViewProps {
  activeSection: string;
}

const TeamLeadView: React.FC<TeamLeadViewProps> = ({ activeSection }) => {
  const { members, tasks } = useSelector((state: RootState) => state.members);
  
  const statusData = [
    { name: 'Working', count: members.filter(m => m.status === 'Working').length, color: '#138808' },
    { name: 'Break', count: members.filter(m => m.status === 'Break').length, color: '#d4af37' },
    { name: 'Meeting', count: members.filter(m => m.status === 'Meeting').length, color: '#ff9933' },
    { name: 'Offline', count: members.filter(m => m.status === 'Offline').length, color: '#000080' },
  ];

  const taskProgress = [
    { name: 'Completed', count: tasks.filter(t => t.completed).length },
    { name: 'In Progress', count: tasks.filter(t => !t.completed && t.progress > 0).length },
    { name: 'Not Started', count: tasks.filter(t => t.progress === 0).length },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="hover-lift">
          <Card className="status-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-3xl font-bold text-primary">{members.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="hover-lift">
          <Card className="status-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                  <p className="text-3xl font-bold text-accent">{tasks.filter(t => !t.completed).length}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="hover-lift">
          <Card className="status-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Online Now</p>
                  <p className="text-3xl font-bold text-indian-green">{members.filter(m => m.status !== 'Offline').length}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indian-green to-green-500 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="hover-lift">
          <Card className="status-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold text-saffron">
                    {tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-saffron" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="status-card">
          <CardHeader>
            <CardTitle className="text-foreground">Team Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.map((status) => (
                <div
                  key={status.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover-lift"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="font-medium text-foreground">{status.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-foreground">{status.count}</span>
                    <div className="w-24">
                      <Progress 
                        value={(status.count / members.length) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="status-card">
          <CardHeader>
            <CardTitle className="text-foreground">Task Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taskProgress.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover-lift"
                >
                  <span className="font-medium text-foreground">{item.name}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-primary">{item.count}</span>
                    <div className="w-24">
                      <Progress 
                        value={tasks.length ? (item.count / tasks.length) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Team Members</h2>
        <Badge variant="secondary" className="status-working">
          {members.filter(m => m.status !== 'Offline').length} / {members.length} Online
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Task Management</h2>
        <Button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TaskForm />
        </div>
        <div className="lg:col-span-2">
          <TaskList />
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Analytics & Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="status-card hover-lift">
          <CardHeader>
            <CardTitle>Productivity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Advanced analytics coming soon...</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="status-card hover-lift">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                <span className="text-sm text-muted-foreground">Average Task Completion</span>
                <span className="font-semibold text-primary">3.2 days</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                <span className="text-sm text-muted-foreground">Team Efficiency</span>
                <span className="font-semibold text-accent">87%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                <span className="text-sm text-muted-foreground">Active Hours/Day</span>
                <span className="font-semibold text-indian-green">6.5 hrs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'members': return renderMembers();
      case 'tasks': return renderTasks();
      case 'analytics': return renderAnalytics();
      default: return renderOverview();
    }
  };

  return <div className="space-y-6">{renderSection()}</div>;
};

export default TeamLeadView;