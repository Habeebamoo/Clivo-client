import { useDispatch } from "react-redux";
import { setPosts, type Article } from "../redux/reducers/article_reducer";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const getfeed = async () => {
  //real logic
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/article`, {
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
    }

    const articles: Article = response.data;

    return articles;
  } catch (error) {
    throw new Error("Something went wrong")
  }
}

export const useFetchFeed = () => {
  const dispatch = useDispatch()

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["feed"],
    queryFn: getfeed,
  })

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setPosts(data))
    }
  }, [isSuccess, data, dispatch])

  return { isLoading, isError }
}