import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./user_reducer";

export type Appeal = {
  userId: string,
  name: string,
  picture: string,
  username: string,
  message: string
}

interface initialStateType {
  user: User | {},
  appeal: Appeal | {},
  users: User[] | [],
  appeals: Appeal[] | [],
}

const initialState: initialStateType = {
  user: {},
  appeal: {},
  users: [],
  appeals: []
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    
    setAppeal: (state, action: PayloadAction<Appeal>) => {
      state.appeal = action.payload
    },

    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },

    setAppeals: (state, action: PayloadAction<Appeal[]>) => {
      state.appeals = action.payload;
    }
  }
})

export const { setUser, setAppeal, setUsers, setAppeals } = adminSlice.actions;
export default adminSlice.reducer;