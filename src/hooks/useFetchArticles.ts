import { setArticles, type Article } from "../redux/reducers/article_reducer";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const getArticles = async () => {
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

export const useFetchArticles = () => {
  const dispatch = useDispatch()

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["my-articles"],
    queryFn: getArticles
  })

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setArticles(data))
    }
  }, [dispatch, isSuccess, data])

  return { isLoading, isError }
}