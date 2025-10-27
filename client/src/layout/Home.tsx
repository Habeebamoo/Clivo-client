import { Outlet, useNavigate } from "react-router"
import Header from "../components/Header"
import { useSelector } from "react-redux"

const Layout = () => {
  const user = useSelector((state: any) => state.user.profile)
  const navigate = useNavigate()

  if (!user) {
    navigate("/")
  }
  
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