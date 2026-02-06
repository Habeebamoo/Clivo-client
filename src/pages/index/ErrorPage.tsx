import { useNavigate, useSearchParams } from "react-router"
import errorImg from "../../assets/error.jpg"
import { H1 } from "../../components/Typo"

const ErrorPage = () => {
  const [ searchParams ] = useSearchParams()
  const navigate = useNavigate()
  const reason = searchParams.get("reason")

  const backtoLogin = () => {
    navigate(-1)
  }

  return (
    <main className="flex-center">
      <div className="flex-center flex-col mt-30">
        <img src={errorImg} className="h-50" />
        <H1 font="inter" text="Google Login Failed" />

        <p className="mt-2 text-sm font-outfit text-accent">We appologize for the incovinience right now</p>
        <p className="mt-2 text-[10px] font-inter text-accent">ERR_STATUS: {reason || "Something went wrong."}</p>

        <button 
          onClick={backtoLogin} 
          className="btn-primary text-sm font-inter mt-4 py-2 px-4"
        >
          Try Again
        </button>
      </div>
    </main>
  )
}

export default ErrorPage