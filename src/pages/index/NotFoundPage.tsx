import { SlArrowLeft } from "react-icons/sl"
import { H2 } from "../../components/Typo"
import { useNavigate } from "react-router"

const NotFoundPage = () => {
  const navigate = useNavigate()

  const toHome = () => {
    navigate("/")
  }

  return (
    <main>
      <div className="mt-70 gap-3 flex-center">
        <H2 font="inter" text="404" />
        <div className="bg-primary p-[1px] h-8"></div>
        <p className="font-exo">This Page Does Not Exists.</p>
      </div>
      <button onClick={toHome} className="btn-primary flex-center gap-2 text-sm mx-auto mt-8 py-2 rounded-md">
        <SlArrowLeft />
        <span>Head Back</span>
      </button>
    </main>
  )
}

export default NotFoundPage