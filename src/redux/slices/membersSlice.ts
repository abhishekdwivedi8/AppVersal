import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Member {
  id: number;
  name: string;
  status: 'Working' | 'Break' | 'Meeting' | 'Offline';
  avatar: string;
  lastActive: string;
  tasks: number[];
}

interface Task {
  id: number;
  title: string;
  description?: string;
  assignedTo: number;
  dueDate: string;
  progress: number;
  completed: boolean;
  createdAt: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface Filters {
  status: string;
  sortBy: string;
}

interface MembersState {
  members: Member[];
  tasks: Task[];
  filters: Filters;
}

const initialState: MembersState = {
  members: [
    {
      id: 1,
      name: 'John Doe',
      status: 'Working',
      avatar: '👨‍💼',
      lastActive: new Date().toISOString(),
      tasks: []
    },
    {
      id: 2,
      name: 'Sarah Smith',
      status: 'Break',
      avatar: '👩‍💻',
      lastActive: new Date().toISOString(),
      tasks: []
    },
    {
      id: 3,
      name: 'Mike Johnson',
      status: 'Meeting',
      avatar: '👨‍💻',
      lastActive: new Date().toISOString(),
      tasks: []
    },
    {
      id: 4,
      name: 'Emma Wilson',
      status: 'Offline',
      avatar: '👩‍💼',
      lastActive: new Date(Date.now() - 15 * 60000).toISOString(),
      tasks: []
    }
  ],
  tasks: [
    {
      id: 1,
      title: 'Complete Dashboard Design',
      assignedTo: 1,
      dueDate: '2024-01-15',
      progress: 75,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Review Code Changes',
      assignedTo: 2,
      dueDate: '2024-01-12',
      progress: 30,
      completed: false,
      createdAt: new Date().toISOString()
    }
  ],
  filters: {
    status: 'All',
    sortBy: 'name'
  }
};

export const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    updateMemberStatus: (state, action: PayloadAction<{ memberId: number; status: Member['status'] }>) => {
      const { memberId, status } = action.payload;
      const member = state.members.find(m => m.id === memberId);
      if (member) {
        member.status = status;
        member.lastActive = new Date().toISOString();
      }
    },
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'progress' | 'completed' | 'createdAt'>>) => {
      const newTask: Task = {
        id: Date.now(),
        ...action.payload,
        progress: 0,
        completed: false,
        createdAt: new Date().toISOString()
      };
      state.tasks.push(newTask);
    },
    updateTaskProgress: (state, action: PayloadAction<{ taskId: number; progress: number }>) => {
      const { taskId, progress } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.progress = Math.max(0, Math.min(100, progress));
        if (task.progress === 100) {
          task.completed = true;
        } else {
          task.completed = false;
        }
      }
    },
    markTaskComplete: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = true;
        task.progress = 100;
      }
    },
    setFilter: (state, action: PayloadAction<{ filterType: keyof Filters; value: string }>) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    }
  }
});

export const { 
  updateMemberStatus, 
  addTask, 
  updateTaskProgress, 
  markTaskComplete,
  setFilter 
} = membersSlice.actions;

export type { Member, Task, MembersState };
export default membersSlice.reducer;