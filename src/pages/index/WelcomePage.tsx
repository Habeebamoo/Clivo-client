import { useEffect, useState } from "react"
import Header from "../../components/Header"
import PhotoGrid from "../../components/PhotoGrid"
import Alert from "../../components/Alert"
import SubscribeModal from "../../components/SubscribeModal"

const Home = () => {
  const [subscribeModal, setSubscribeModal] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "error">("success")
  const [alertText, setAlertText] = useState<string>("")
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (subscribeModal) {
      setTimeout(() => {
        setSubscribeModal(false)
      }, 4000)
    }
  }, [subscribeModal])

  useEffect(() => {
    if (alertModal) {
      setTimeout(() => {
        setAlertModal(false)
      }, 3000)
    }
  }, [alertModal])

  const setAlert = (status: "success" | "error", text: string) => {
    setAlertModal(true)
    setAlertStatus(status)
    setAlertText(text)
  }

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        setAlert("error", data.message)
        return
      }

      setSubscribeModal(true)
      setEmail("")
    } catch (error) {
      setAlert("error", "Subscription failed")
    }
  }

  useEffect(() => {
    const checkAPIHealth = async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/health`, {
        method: "GET",
      })

      const data = await res.json()
      console.log(data)
    }

    checkAPIHealth()
  }, [])

  return (
    <main className="bg-center bg-cover min-h-screen">
      <div className="bg-white/70 inset-0">
        {subscribeModal && <SubscribeModal />}
        {alertModal && <Alert status={alertStatus} text={alertText} />}
        <Header />

        {/* Hero section */}
        <div className="mt-18 pt-10 px-4">
          <h1 className="md:text-center font-dm text-3xl">Where <span className="text-secondary">Simple Stories</span> Find Their Voices.</h1>

          <p className="font-jsl text-gray-700 text-sm mt-4 mb-20 lg:mx-auto md:text-center lg:w-[50%]">
            Clivo is a platform for writers who demands excellence - Craft, Publish, and share your stories with a community that values quality
          </p>

          <PhotoGrid />
        </div>

        {/* Subscription Section */}
        <div className="mt-20 pb-20 p-4">
          <h1 className="text-center font-dm text-3xl">Stay <span className="text-secondary">Inspired.</span></h1>

          <p className="font-jsl text-sm text-center text-gray-700 mt-2 lg:mx-auto md:text-center lg:w-[50%]">
            Join our community of discerning readers and receive carefully selected stories, writing insights, and exclusive content delivered to your inbox.
          </p>

          <form onSubmit={subscribe} className="mt-4 px-5 relative sm:w-100 mx-auto">
            <input 
              type="email" 
              className="border border-accent p-3 rounded-xl w-full text-sm placeholder:text-accent pr-27 focus:outline-none"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn-primary text-sm font-outfit absolute right-7.5 top-2">Subscribe</button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Home