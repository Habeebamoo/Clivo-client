import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./user_reducer";

interface initialStateType {
  user: User | {}
}

const initialState: initialStateType = {
  user: {}
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    }
  }
})

export const { setUser } = adminSlice.actions;
export default adminSlice.reducer;