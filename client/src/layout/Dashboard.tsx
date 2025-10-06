import { Outlet } from "react-router"
import Header from "../components/Header"

const Layout = () => {
  return (
    <>
      <Header type="dashboard" />
      {/* margin top to avoid header */}
      <div className="mt-18"></div>
      <Outlet />
    </>
  )
}

export default Layout