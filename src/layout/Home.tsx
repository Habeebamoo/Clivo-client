import { Navigate, Outlet } from "react-router"
import Header from "../components/Header"
import { useSelector } from "react-redux"
import { useFetchProfile } from "../hooks/useFetchProfile"
import Loading from "../components/Loading"
import { useEffect } from "react"

const Layout = () => {
  const { isLoading } = useFetchProfile()
  const user = useSelector((state: any) => state.user.profile)

  useEffect(() => {
    if (!isLoading && !user.email) {
      <Navigate to={"/signin"} />
    }
  }, [user, isLoading])

  if (isLoading) return <Loading />

  return (
    <>
      <Header type="home" />

      {/* margin top to avoid header */}
      <div className="mt-18"></div>
      <Outlet />
    </>
  )
}

export default Layout