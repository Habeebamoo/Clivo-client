import { Outlet, useNavigate } from "react-router"
import Header from "../components/Header"
import { useSelector } from "react-redux"
import { useFetchProfile } from "../hooks/useFetchProfile"
import Loading from "../components/Loading"
import { useEffect } from "react"

const Layout = () => {
  const { isLoading } = useFetchProfile()
  const user = useSelector((state: any) => state.user.profile)
  const navigate = useNavigate()
  console.log(user)

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/")
    }
  }, [isLoading, user])

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