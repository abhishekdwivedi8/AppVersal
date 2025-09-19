import React from 'react';
import { Member } from '../redux/slices/membersSlice';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface StatusSelectorProps {
  currentStatus: Member['status'];
  onStatusChange: (status: Member['status']) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus, onStatusChange }) => {
  const statuses: Array<{
    value: Member['status'];
    label: string;
    icon: string;
    color: string;
    description: string;
  }> = [
    { 
      value: 'Working' as const, 
      label: 'Working', 
      icon: '💼', 
      color: 'status-working',
      description: 'Focused on tasks'
    },
    { 
      value: 'Break' as const, 
      label: 'On Break', 
      icon: '☕', 
      color: 'status-break',
      description: 'Taking a break'
    },
    { 
      value: 'Meeting' as const, 
      label: 'In Meeting', 
      icon: '🤝', 
      color: 'status-meeting',
      description: 'Currently in a meeting'
    },
    { 
      value: 'Offline' as const, 
      label: 'Offline', 
      icon: '💤', 
      color: 'status-offline',
      description: 'Away from work'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-background to-secondary border-border">
      <CardContent className="p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Update Your Status</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {statuses.map((status) => (
            <Button
              key={status.value}
              variant="ghost"
              className={`w-full h-auto p-4 flex flex-col items-center space-y-2 border-2 transition-all duration-200 rounded-xl ${
                currentStatus === status.value
                  ? `${status.color} border-current shadow-md`
                  : 'hover:bg-muted/50 border-border hover:border-primary/50'
              }`}
              onClick={() => onStatusChange(status.value)}
            >
              <div className="text-2xl">{status.icon}</div>
              
              <div className="text-center">
                <p className={`font-semibold text-sm ${
                  currentStatus === status.value ? 'text-current' : 'text-foreground'
                }`}>
                  {status.label}
                </p>
                <p className={`text-xs ${
                  currentStatus === status.value ? 'text-current opacity-80' : 'text-muted-foreground'
                }`}>
                  {status.description}
                </p>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="text-lg">{statuses.find(s => s.value === currentStatus)?.icon || '❓'}</div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Current Status: <span className="text-primary">{currentStatus || 'Unknown'}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Status will auto-reset to offline after 10 minutes of inactivity
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSelector;