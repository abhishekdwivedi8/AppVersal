import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface RoleState {
  currentRole: 'Team Lead' | 'Team Member';
  currentUser: User;
}

const initialState: RoleState = {
  currentRole: 'Team Lead',
  currentUser: {
    id: 1,
    name: 'John Doe',
    avatar: '👨‍💼'
  }
};

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    switchRole: (state, action: PayloadAction<'Team Lead' | 'Team Member'>) => {
      state.currentRole = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    }
  }
});

export const { switchRole, updateUser } = roleSlice.actions;
export default roleSlice.reducer;