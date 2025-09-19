import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTaskProgress, markTaskComplete } from '../redux/slices/membersSlice';
import { RootState } from '../redux/store';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  CheckSquare, 
  Calendar, 
  User, 
  Plus, 
  Minus, 
  Check,
  Filter,
  SortAsc,
  AlertCircle,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '../hooks/use-toast';

interface TaskListProps {
  memberView?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ memberView = false }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { members, tasks } = useSelector((state: RootState) => state.members);
  const { currentUser } = useSelector((state: RootState) => state.role);
  
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterStatus, setFilterStatus] = useState('all');

  const displayTasks = memberView 
    ? tasks.filter(t => t.assignedTo === currentUser.id)
    : tasks;

  const filteredTasks = displayTasks
    .filter(task => {
      if (filterStatus === 'completed') return task.completed;
      if (filterStatus === 'active') return !task.completed;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'progress':
          return b.progress - a.progress;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getMemberById = (id: number) => members.find(m => m.id === id);

  const handleProgressUpdate = (taskId: number, delta: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newProgress = Math.max(0, Math.min(100, task.progress + delta));
    
    dispatch(updateTaskProgress({ taskId, progress: newProgress }));
    
    if (newProgress === 100) {
      dispatch(markTaskComplete(taskId));
      toast({
        title: "Task Completed! 🎉",
        description: "Great job! Task has been marked as complete.",
        variant: "default",
      });
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Low': return 'status-working';
      case 'Medium': return 'status-break';
      case 'High': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'Critical': return 'status-meeting';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const isOverdue = (dueDate: string, completed: boolean) => {
    return new Date(dueDate) < new Date() && !completed;
  };

  return (
    <div className="hover-lift">
      <Card className="status-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckSquare className="w-6 h-6 mr-3 text-primary" />
              {memberView ? 'My Tasks' : 'All Tasks'}
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {filteredTasks.length} Tasks
            </Badge>
          </CardTitle>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <SortAsc className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No tasks found</p>
              <p className="text-muted-foreground text-sm">
                {memberView ? 'No tasks assigned to you yet' : 'Create a new task to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const assignedMember = getMemberById(task.assignedTo);
                const overdue = isOverdue(task.dueDate, task.completed);
                
                return (
                  <div
                    key={task.id}
                    className={`p-6 rounded-xl border transition-all duration-200 hover-lift ${
                      task.completed 
                        ? 'bg-gradient-to-br from-indian-green/5 to-indian-green/10 border-indian-green/30'
                        : overdue
                        ? 'bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/30'
                        : 'bg-gradient-to-br from-background to-secondary border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`font-semibold text-lg ${
                            task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}>
                            {task.title}
                          </h3>
                          
                          {task.completed && (
                            <div className="flex items-center justify-center w-6 h-6 bg-indian-green rounded-full">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                          
                          {overdue && !task.completed && (
                            <div className="flex items-center text-destructive">
                              <AlertCircle className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        
                        {task.description && (
                          <p className="text-muted-foreground text-sm mb-3">{task.description}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          {!memberView && assignedMember && (
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Assigned to:</span>
                              <div className="flex items-center space-x-1">
                                <span>{assignedMember.avatar}</span>
                                <span className="font-medium text-foreground">{assignedMember.name}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Due:</span>
                            <span className={`font-medium ${overdue && !task.completed ? 'text-destructive' : 'text-foreground'}`}>
                              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                            </span>
                            {!task.completed && (
                              <span className="text-xs text-muted-foreground">
                                ({formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })})
                              </span>
                            )}
                          </div>
                          
                          {task.priority && (
                            <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">{task.progress}%</span>
                      </div>
                      
                      <Progress value={task.progress} className="h-3" />

                      {/* Progress Controls */}
                      {memberView && !task.completed && (
                        <div className="flex items-center justify-center space-x-3 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProgressUpdate(task.id, -10)}
                            disabled={task.progress <= 0}
                            className="hover:bg-destructive/10 hover:border-destructive/30"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <span className="text-sm text-muted-foreground px-4">
                            Update Progress (±10%)
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProgressUpdate(task.id, 10)}
                            disabled={task.progress >= 100}
                            className="hover:bg-indian-green/10 hover:border-indian-green/30"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {/* Complete Button */}
                      {memberView && task.progress === 100 && !task.completed && (
                        <div className="pt-2">
                          <Button
                            className="btn-primary w-full"
                            onClick={() => {
                              dispatch(markTaskComplete(task.id));
                              toast({
                                title: "Task Completed! 🎉",
                                description: "Congratulations on completing this task!",
                                variant: "default",
                              });
                            }}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Mark as Complete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskList;