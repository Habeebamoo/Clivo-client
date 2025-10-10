import { useDispatch } from "react-redux";
import { setPosts, type Post } from "../redux/reducers/article_reducer";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const getfeed = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000)
  );
  const articles: Post[] = [
    {articleId: "weio", authorPicture: "", authorFullname: "Habeeb Amoo", authorVerified: false, title:"Go or Rust for backend developement", content: "welcome", createdAt: "4 weeks ago", picture: "", tags: ["Tech", "Software"], likes: 16, readTime: "6 mins read time", slug: ""},
  ]
  
  return articles
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