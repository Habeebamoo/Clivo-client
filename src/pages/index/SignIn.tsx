import { H1 } from "../../components/Typo"
import googleImg from "../../assets/google.png"
import logo from "../../assets/logo2.png"
import Button from "../../components/Button"

const SignInPage = () => {
  const login = () => {
    //prod
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/auth/google`

    //dev
    //navigate("/home")
  }

  return (
    <main className="pt-50 flex-center flex-col">
      <img src={logo} className="h-20 mb-6" />

      <H1 font="outfit-rich" text="Welcome To Clivo" />

      <p 
        className="text-gray-700 text-center font-open text-sm mb-6 mt-4 w-[90%]"
      >
        Sign in with your Google account to continue with Clivo.
      </p>

      <Button action={login} text="Continue With Google" img={googleImg} imgClass="h-5" />
    </main>
  )
}

export default SignInPage