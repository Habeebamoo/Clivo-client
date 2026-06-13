"use client";

import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setProfile } from "@/src/redux/reducers/user";
import type { User } from "@/src/types/user";

const getProfile = async (): Promise<User> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/me`,
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

  return response.data as User;
};

export const useFetchProfile = () => {
  const dispatch = useDispatch();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setProfile(data));
    }
  }, [isSuccess, data, dispatch]);

  return { isLoading, isError };
};
