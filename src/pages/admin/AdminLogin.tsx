import Button from "../../components/Button"
import googleImg from "../../assets/google.png"
import logo from "../../assets/logo2.png"
import { H2 } from "../../components/Typo"

const AdminLogin = () => {
  const login = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/auth/admin/google`
  }

  return (
    <main className="flex-center flex-col h-screen">
      <img src={logo} className="h-20 mb-6" />

      <H2 font="inter" text="Admin Login" />

      <p 
        className="text-gray-700 text-center font-jsans text-sm mb-6 mt-4 w-[90%]"
      >
        Welcome back. Manage all your users from your dashboard
      </p>

      <Button action={login} text="Continue With Google" img={googleImg} imgClass="h-5" />
    </main>
  )
}

export default AdminLogin