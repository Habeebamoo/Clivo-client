import { H1 } from "../../components/Typo"
import logo from "../../assets/logo.jpg"
import googleImg from "../../assets/google.png"
import Button from "../../components/Button"
import { useNavigate } from "react-router"

const LoginPage = () => {
  const navigate = useNavigate()

  const login = () => {
    navigate("/dashboard")
  }

  return (
    <main className="flex-center flex-col h-[100vh]">
      <img src={logo} className="h-10 rounded-md mb-8" />
      <H1 font="inter" text="Sign In With Google" others="mb-6" />
      <Button action={login} text="Continue With Google" img={googleImg} imgClass="h-5" />
    </main>
  )
}

export default LoginPage