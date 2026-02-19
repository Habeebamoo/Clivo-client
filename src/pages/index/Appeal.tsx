import AdminHeader from "../../components/AdminHeader"
import lockImg from "../../assets/padlock.png"
import pencilImg from "../../assets/pencil.png"
import { PiWarning } from "react-icons/pi"
import { TiCancel } from "react-icons/ti"
import { MdAccessTimeFilled } from "react-icons/md"
import { IoEyeOff } from "react-icons/io5"
import { useEffect, useState } from "react"
import { BiMessage } from "react-icons/bi"
import { useNavigate, useParams } from "react-router"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import Spinner from "../../components/Spinner"

const AppealPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAppealStatus = async () => {
      setLoading(true)

      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/appeal-status/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_API_KEY
          }
        });

        const response = await res.json();

        if (!res.ok) {
          navigate("/signin")
          return
        }

        if (!response.data.status) {
          navigate("/signin")
        }

      } catch (error) {
        navigate("/signin")
      } finally {
        setLoading(false)
      }
    }

    fetchAppealStatus()
  }, [])

  const submitAppeal = async () => {
    setBtnLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/appeals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({
          userId,
          message
        })
      });

      const response = await res.json()

      if (!res.ok) {
        toast.error(response.message)
        return
      }

      toast.success(response.message)
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setBtnLoading(false)
    }
  }

  return (
    <main>
      <AdminHeader />
      {loading && <Loading />}

      <section className="w-[90%] mt-30 sm:w-125 mx-auto relative border border-gray-200">
        <div className="flex-center py-10 bg-yellow-100">
          <img src={lockImg} className="h-70" />
        </div>

        <div className="absolute px-10 top-0 bottom-0 left-0 right-0 bg-white/90 flex-center flex-col">
          <PiWarning size={30} color="red" className="mx-auto mt-8" />

          <h1 className="font-inter mt-4 text-3xl text-center">
            Your account has been restricted
          </h1>

          <p className="font-jsans mt-6 text-center text-gray-500">
            We've detected activities on your account that may violate our community guidelines. You can submit an appeal below if you believe this was a mistake.
          </p>
        </div>
      </section>

      <section className="w-[90%] sm:w-125 mx-auto my-20 bg-gray-50 px-5 py-8 border border-gray-200">
        <div className="flex-start gap-4">
          <img src={pencilImg} className="h-5" />
          <h1 className="font-inter text-xl">Submit an appeal</h1>
        </div>

        <hr className="mt-5 text-gray-200" />

        <p className="font-inter mt-8 text-gray-700 text-center">
          Why are you appealing this restriction?
        </p>

        <div
          onClick={() => setMessage("I believe this was a mistake")} 
          className="appeal-radio mt-10"
        >
          <input type="radio" name="reason" />
          <p>I believe this was a mistake</p>
        </div>

        <div 
          onClick={() => setMessage("I've updated the flagged content")} 
          className="appeal-radio mt-6"
        >
          <input type="radio" name="reason" />
          <p>I've updated the flagged content</p>
        </div>

        <div
          onClick={() => setMessage("other reason")} 
          className="appeal-radio mt-6"
        >
          <input type="radio" name="reason" />
          <p>Other reason</p>
        </div>

        <div className="flex-start gap-2 font-jsans mt-15">
          <BiMessage />
          <p>Or write your reason here</p>
        </div>

        <hr className="mt-5 text-gray-200" />

        <textarea
          rows={4} 
          className="resize-none bg-white focus:outline-none border border-gray-200 w-full mt-8 p-6"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        >
        </textarea>

        {btnLoading ? 
          <button className="bg-gray-200 py-4 border text-white border-gray-300 w-full mt-8 flex-center">
            <Spinner color="white" size={20} />
          </button>
        :
          <button
            onClick={submitAppeal} 
            className="btn-primary py-3 w-full mt-8"
          >
            Submit Appeal
          </button>
        }
      </section>

      <section className="w-[90%] sm:w-125 mx-auto my-20 bg-gray-50 px-5 py-8 border border-gray-200">
        <h1 className="font-inter text-lg">What this means for your account</h1>

        <div 
          className="flex justify-start items-start bg-gray-100 border border-gray-200 py-4 px-2 w-80 mx-auto gap-4 mt-8"
        >
          <TiCancel size={24} className="mt-1 text-gray-700" />

          <div className="font-inter">
            <p className="text-gray-700">Publishing</p>

            <p className="text-gray-500 font-outfit">
              You cannot publish new articles
            </p>
          </div>
        </div>

        <div 
          className="flex justify-start items-start bg-gray-100 border border-gray-200 p-4 w-80 mx-auto gap-4 mt-6"
        >
          <IoEyeOff size={20} className="mt-1 text-gray-700" />

          <div className="font-inter">
            <p className="text-gray-700">Visibility</p>

            <p className="text-gray-500 font-outfit">
              You can still read articles.
            </p>
          </div>
        </div>

        <div 
          className="flex justify-start items-start bg-gray-100 border border-gray-200 p-4 w-80 mx-auto gap-4 mt-6"
        >
          <MdAccessTimeFilled size={24} className="mt-1 text-gray-700" />

          <div className="font-inter">
            <p className="text-gray-700">Review Period</p>

            <p className="text-gray-500 font-outfit">
              Appeals reviews takes 3-5 business days.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AppealPage