import { useEffect } from "react"
import avatar from "../assets/error.jpg"
import { useNavigate } from "react-router"

const ErrorElement = ({ to }: { to: string }) => {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate(to)
    }, 3000)
  }, [])

  return (
    <div className="flex-center flex-col mt-20">
      <img src={avatar} className="h-60 md:h-70" />
      <h1 className="text-4xl md:text-5xl text-center font-outfit">Oops</h1>
      <p className="text-center font-outfit text-gray-900 mt-6 w-[90%] mx-auto">An unexpected has error occurred, please try again.</p>
    </div>
  )
}

export default ErrorElement