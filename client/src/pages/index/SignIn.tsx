import { H2 } from "../../components/Typo"
import googleImg from "../../assets/google.png"
import logo from "../../assets/logo2.png"
import Button from "../../components/Button"
import { useNavigate } from "react-router"

const SignInPage = () => {
  const navigate = useNavigate()

  const login = () => {
    //prod
    //window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/auth/google`

    //dev
    navigate("/home")
  }

  return (
    <main className="flex-center flex-col h-screen">
      <img src={logo} className="h-20 mb-6" />

      <H2 font="inter" text="Welcome To Clivo" />

      <p 
        className="text-gray-700 text-center font-jsans text-sm mb-6 mt-4 w-[90%]"
      >
        Sign in with your Google account to continue with Clivo.
      </p>

      <Button action={login} text="Continue With Google" img={googleImg} imgClass="h-5" />
    </main>
  )
}

export default SignInPage