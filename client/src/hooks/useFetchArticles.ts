import { setArticles, type Post } from "../redux/reducers/article_reducer";
import logo from "../assets/logo.jpg"
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const getArticles = async () => {
  //real logic

  //fake logic
  await new Promise((resolve) => setTimeout(resolve, 2000)
  );

  const articles: Post[] = [
    {articleId:"jfif", authorPicture: logo, authorFullname: "Clivo", authorVerified: true, title:"How to get a verified account", content: "Hello", createdAt: "2 months ago", picture: logo, tags: ["Tech", "Design", "Business"], likes: 5, readTime: "1 mins read time", slug: ""},
    {articleId: "weio", authorPicture: "", authorFullname: "Habeeb Amoo", authorVerified: false, title:"Go or Rust for backend developement", content: "welcome", createdAt: "4 weeks ago", picture: "", tags: ["Tech", "Software"], likes: 16, readTime: "6 mins read time", slug: ""},
  ];

  return articles;
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