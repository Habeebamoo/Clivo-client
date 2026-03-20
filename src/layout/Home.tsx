import { Navigate, Outlet } from "react-router"
import Header from "../components/Header"
import { useSelector } from "react-redux"
import { useFetchProfile } from "../hooks/useFetchProfile"
import { useEffect } from "react"

const Layout = () => {
  const {} = useFetchProfile()
  const user = useSelector((state: any) => state.user.profile)

  useEffect(() => {
    if (!user.email) {
      <Navigate to={"/signin"} />
    }
  }, [user])

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