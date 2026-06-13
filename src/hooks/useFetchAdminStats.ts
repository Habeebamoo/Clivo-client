"use client";

import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setAppeals, setUsers } from "@/src/redux/reducers/admin";

const getAdminStats = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`,
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

export const useFetchAdminStats = () => {
  const dispatch = useDispatch();

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUsers(data.users));
      dispatch(setAppeals(data.appeals));
    }
  }, [dispatch, isSuccess, data]);

  return { isLoading, isError };
};
