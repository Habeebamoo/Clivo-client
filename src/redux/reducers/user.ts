import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/src/types/user";

interface UserReducerState {
  profile: User | Record<string, never>;
}

const initialState: UserReducerState = {
  profile: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = userSlice.actions;
export default userSlice.reducer;
