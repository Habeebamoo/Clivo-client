import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setProfile, type User } from "../redux/reducers/user_reducer";

const getProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000)
  );

  const me: User = {
    userId: "",
    name: "Habeeb Amoo",
    email: "habeebamoo08@gmail.com",
    role: "user",
    verified: true,
    isBanned: false,
    username: "@habeebamoo08i",
    bio: "Clivo CEO",
    picture: "",
    interests: ["Tech", "Science"],
    profileUrl: "",
    website: "habeebamoo.netlify.app",
    following: 15,
    followers: 400,
    createdAt: "3 months ago"
  }
  
  return me
}

export const useFetchProfile = () => {
  const dispatch = useDispatch()

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getProfile,
  })

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setProfile(data))
    }
  }, [isSuccess, data, dispatch])

  return { isLoading, isError }
}