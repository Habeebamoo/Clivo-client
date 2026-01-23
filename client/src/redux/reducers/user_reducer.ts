import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
  userId: string,
  name: string,
  email: string,
  role: string,
  verified: boolean,
  isBanned: boolean,
  username: string,
  bio: string,
  picture: string,
  interests: string[],
  profileUrl: string,
  website: string,
  following: number,
  followers: number,
  createdAt: string
}

interface UserReducerState {
  profile: User | {},
}

const initialState: UserReducerState = {
  profile: {}
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    }
  }
})

export const { setProfile } = userSlice.actions;
export default userSlice.reducer;