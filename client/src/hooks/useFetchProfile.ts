import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setProfile, type User } from "../redux/reducers/user_reducer";

const getProfile = async () => {
  try {
    console.log("fetching user....")
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_API_KEY
      },
      credentials: "include"
    })

    const response = await res.json()

    if (!res.ok) {
      throw new Error(response.message)
    } else {
      const user: User = response.data;
      return user;
    }
  } catch (error: any) {
    throw new Error(error)
  }
}

export const useFetchProfile = () => {
  const dispatch = useDispatch()

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getProfile,
  })

  useEffect(() => {
    if (isSuccess && data) {
      console.log("success...")
      dispatch(setProfile(data))
    }
  }, [isSuccess, data, dispatch])

  return { isLoading, isError }
}