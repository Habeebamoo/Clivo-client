import type { Post } from "../redux/reducers/article_reducer"
import type { User } from "../redux/reducers/user_reducer"
import { useQuery } from "@tanstack/react-query"

const getUser = async (username: string) => {
  try {
    //get user
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_API_KEY 
      }
    })
    const response = await res.json()

    if (!response.success) {
      throw new Error(response.message)
    }

    const user: User = response.data;


    //get user articles
    const res2 = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/${username}/articles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_API_KEY 
      }
    })
    const response2 = await res2.json()

    if (!response2.success) {
      throw new Error(response.message)
    }

    const userArticles: Post[] = response2.data;

    return { user, userArticles };
    
  } catch (error) {
    throw new Error("")
  }
}

export const useFetchUser = (username: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(username)
  })

  return { data, isLoading, isError }
}