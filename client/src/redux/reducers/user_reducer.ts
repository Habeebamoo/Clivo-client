import { createSlice } from "@reduxjs/toolkit";

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

const initialState = {
  user: {
    userId: "",
    name: "Habeeb Amoo",
    email: "habeebamoo08@gmail.com",
    role: "user",
    verified: true,
    isBanned: false,
    username: "@habeebamoo08",
    bio: "Clivo CEO",
    picture: "",
    interests: ["Tech", "Science"],
    profileUrl: "",
    website: "habeebamoo.netlify.app",
    following: 15,
    followers: 400,
    createdAt: "3 months ago"
  }
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: any, action: any) => {
      console.log(state)
      console.log(action.payload)
    }
  }
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;