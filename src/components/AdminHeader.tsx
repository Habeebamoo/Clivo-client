import { ToastContainer } from "react-toastify"
import Loading from "./Loading"
import logo from "../assets/logo.jpg"
import { useState } from "react"

const AdminHeader = () => {
  const [loading] = useState<boolean>(false)

  return (
    <header className="py-4 px-6 sm:px-8 flex-start shadow bg-white fixed top-0 left-0 right-0 z-20">
      <ToastContainer />
      {loading && <Loading />}

      <img src={logo} className="h-8 rounded-sm" />
      <h1 className="text-2xl font-bold font-inter ml-2">Clivo</h1>
    </header>
  )
}

export default AdminHeader