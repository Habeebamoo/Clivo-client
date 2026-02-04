import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./user_reducer";

export type Appeal = {
  userFullname: string,
  username: string,
  userPicture: string,
  banReason: string,
  appealMessage: string
}

interface initialStateType {
  user: User | {},
  appeal: Appeal | {},
}

const initialState: initialStateType = {
  user: {},
  appeal: {}
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAppeal: (state, action: PayloadAction<Appeal>) => {
      state.appeal = action.payload;
    }
  }
})

export const { setUser, setAppeal } = adminSlice.actions;
export default adminSlice.reducer;