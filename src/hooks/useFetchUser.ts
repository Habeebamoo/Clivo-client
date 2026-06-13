"use client";

import { useQuery } from "@tanstack/react-query";
import type { Post } from "@/src/types/article";
import type { User } from "@/src/types/user";

const getUser = async (username: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
      },
    }
  );
  const response = await res.json();
  if (!response.success) throw new Error(response.message);
  const user: User = response.data;

  const res2 = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${username}/articles`,
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
  const userArticles: Post[] = response2.data;

  return { user, userArticles };
};

export const useFetchUser = (username: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUser(username),
  });

  return { data, isLoading, isError };
};
