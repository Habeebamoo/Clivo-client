import { useDispatch } from "react-redux";
import { setPosts, type Post } from "../redux/reducers/article_reducer";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import logo from "../assets/logo.jpg"

const getfyp = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000)
  );
  const articles: Post[] = [
    {articleId:"jfif", authorPicture: logo, authorFullname: "Clivo", authorProfileUrl: "", authorVerified: true, title:"How to get a verified account", content: "Hello", createdAt: "2 months ago", picture: logo, tags: ["Tech", "Design", "Business"], likes: 5, readTime: "1 mins read time", slug: ""},
    
    {articleId: "weio", authorPicture: "", authorFullname: "Habeeb Amoo", authorProfileUrl: "", authorVerified: false, title:"Go or Rust for backend developement", content: "welcome", createdAt: "4 weeks ago", picture: "", tags: ["Tech", "Software"], likes: 16, readTime: "6 mins read time", slug: ""},
  ]
  
  return articles
}

export const useFetchFyp = () => {
  const dispatch = useDispatch()

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["fyp"],
    queryFn: getfyp,
  })

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setPosts(data))
    }
  }, [isSuccess, data, dispatch])

  return { isLoading, isError }
}