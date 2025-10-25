import { H2 } from "../../components/Typo"
import googleImg from "../../assets/google.png"
import Button from "../../components/Button"
import { useNavigate } from "react-router"

const SignInPage = () => {
  const navigate = useNavigate()

  const login = () => {
    navigate("/home")
  }

  return (
    <main className="flex-center flex-col h-[100vh]">
      <H2 font="inter" text="Sign In With Google" />
      <p className="text-accent text-center text-sm font-inter mb-4 mt-2">Sign in with your google account to continue with Clivo.</p>
      <Button action={login} text="Continue With Google" img={googleImg} imgClass="h-5" />
    </main>
  )
}

export default SignInPage