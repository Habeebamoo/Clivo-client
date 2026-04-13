import { H2 } from "../../components/Typo"
import googleImg from "../../assets/google.png"
import logo from "../../assets/logo2.png"
import Button from "../../components/Button"

const SignInPage = () => {
  const login = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/auth/google`
  }

  return (
    <main className="flex-center h-screen bg-gray-100">
      <div className="bg-white max-sm:w-[90%] px-4 py-10 rounded-2xl border border-gray-200 flex-center flex-col">
        <img src={logo} className="h-15 mb-6" />

        <H2 font="outfit-rich" text="Welcome To Clivo" />

        <p 
          className="text-gray-700 text-center font-outfit text-sm mb-6 mt-4 w-[90%]"
        >
          Sign in with your Google account to continue with Clivo.
        </p>

        <Button action={login} text="Continue With Google" img={googleImg} imgClass="h-5" />
      </div>
    </main>
  )
}

export default SignInPage