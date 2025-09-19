import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask } from '../redux/slices/membersSlice';
import { RootState } from '../redux/store';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { CalendarDays, User, Plus, CheckSquare } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const TaskForm: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { members } = useSelector((state: RootState) => state.members);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.assignedTo || !formData.dueDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(addTask({
      title: formData.title,
      description: formData.description,
      assignedTo: parseInt(formData.assignedTo),
      dueDate: formData.dueDate,
      priority: formData.priority
    }));

    // Reset form
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      priority: 'Medium'
    });

    setIsSubmitting(false);

    toast({
      title: "Task Created!",
      description: `Task "${formData.title}" has been assigned successfully.`,
      variant: "default",
    });
  };

  const priorities = [
    { value: 'Low', color: 'text-indian-green' },
    { value: 'Medium', color: 'text-saffron' },
    { value: 'High', color: 'text-destructive' },
    { value: 'Critical', color: 'text-indian-blue' }
  ];

  return (
    <div className="hover-lift">
      <Card className="status-card">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Plus className="w-6 h-6 mr-3 text-primary" />
            Create New Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">
                Task Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter task title..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-background border-border focus:border-primary transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Task description (optional)..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-background border-border focus:border-primary transition-colors min-h-[80px]"
              />
            </div>

            {/* Assign To */}
            <div className="space-y-2">
              <Label htmlFor="assignedTo" className="text-sm font-medium text-foreground flex items-center">
                <User className="w-4 h-4 mr-2" />
                Assign To *
              </Label>
              <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                <SelectTrigger className="bg-background border-border focus:border-primary">
                  <SelectValue placeholder="Select team member..." />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <span>{member.avatar}</span>
                        <span>{member.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          member.status === 'Working' ? 'status-working' :
                          member.status === 'Break' ? 'status-break' :
                          member.status === 'Meeting' ? 'status-meeting' :
                          'status-offline'
                        }`}>
                          {member.status}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-medium text-foreground flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Due Date *
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="bg-background border-border focus:border-primary transition-colors"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium text-foreground">
                  Priority
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="bg-background border-border focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <span className={`font-medium ${priority.color}`}>
                          {priority.value}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Task...
                </div>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskForm;