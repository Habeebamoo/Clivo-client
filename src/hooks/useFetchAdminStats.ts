import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setAppeals, setUsers } from "../redux/reducers/admin_reducer";

const getAdminStats = async () => {
  //real logic
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_API_KEY
      },
      credentials: "include"
    })

    const response = await res.json()

    if (!res.ok) {
      throw new Error(response.message)
    }

    console.log(response.data)
    return response.data;

  } catch (error) {
    throw new Error("Something went wrong")
  }
}

export const useFetchAdminStats = () => {
  const dispatch = useDispatch()

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats
  })

  useEffect(() => {
    if (isSuccess && data) {
      //set users
      dispatch(setUsers(data.users))

      //set appeals
      dispatch(setAppeals(data.appeals))
    }
  }, [dispatch, isSuccess, data])

  return { isLoading, isError }
}