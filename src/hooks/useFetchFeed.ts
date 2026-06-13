"use client";

import { useDispatch } from "react-redux";
import { setPosts } from "@/src/redux/reducers/article";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const getFeed = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/article/feed`,
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

export const useFetchFeed = () => {
  const dispatch = useDispatch();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["feed"],
    queryFn: getFeed,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setPosts(data));
    }
  }, [isSuccess, data, dispatch]);

  return { isLoading, isError };
};
