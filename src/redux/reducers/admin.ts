import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/src/types/user";
import type { Appeal } from "@/src/types/admin";

interface AdminState {
  user: User | Record<string, never>;
  appeal: Appeal | Record<string, never>;
  users: User[];
  appeals: Appeal[];
}

const initialState: AdminState = {
  user: {},
  appeal: {},
  users: [],
  appeals: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAppeal: (state, action: PayloadAction<Appeal>) => {
      state.appeal = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setAppeals: (state, action: PayloadAction<Appeal[]>) => {
      state.appeals = action.payload;
    },
  },
});

export const { setUser, setAppeal, setUsers, setAppeals } = adminSlice.actions;
export default adminSlice.reducer;
