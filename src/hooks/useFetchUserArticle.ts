"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setArticleComments,
  setUserArticle,
} from "@/src/redux/reducers/article";

const getArticle = async (username: string, title: string) => {
  const res1 = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${username}/${title}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
      },
    }
  );
  const response1 = await res1.json();
  if (!response1.success) throw new Error(response1.message);
  const article = response1.data;

  const res2 = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${username}/${title}/comments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
      },
    }
  );
  const response2 = await res2.json();
  if (!response2.success) throw new Error(response2.message);
  const comments = response2.data;

  return { article, comments };
};

export const useFetchUserArticle = (username: string, title: string) => {
  const dispatch = useDispatch();

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["user-article", username, title],
    queryFn: () => getArticle(username, title),
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUserArticle(data.article));
      dispatch(setArticleComments(data.comments));
    }
  }, [isSuccess, dispatch, data]);

  return { data, isLoading, isError };
};
