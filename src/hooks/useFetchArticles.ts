"use client";

import { setArticles } from "@/src/redux/reducers/article";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const getArticles = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/article`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
      },
      credentials: "include",
    }
  );

  const response = await res.json();
  if (!res.ok) throw new Error(response.message);
  return response.data;
};

export const useFetchArticles = () => {
  const dispatch = useDispatch();

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["my-articles"],
    queryFn: getArticles,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setArticles(data));
    }
  }, [dispatch, isSuccess, data]);

  return { isLoading, isError };
};
