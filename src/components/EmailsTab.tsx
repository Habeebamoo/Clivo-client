import { useState } from "react"
import Spinner from "./Spinner"
import { toast } from "react-toastify";

const EmailsTab = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const sendMails = async () => {
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/sendmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        credentials: "include"
      })

      const response = await res.json()

      if (!res.ok) {
        toast.error(response.message)
        return
      }

      toast.success(response.message)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-mutedLight border border-muted rounded-lg md:w-150 lg:w-200 mx-auto mt-10 mb-10 p-4">
      <h1 className="font-inter">Emails</h1>
      <p className="font-exo text-sm text-accent">Manage all email messages and notifications here</p>

      <div className="mt-10">
        {loading ? 
          <button
            className="bg-gray-200 border border-gray-300 rounded-lg w-30 py-3 flex-center text-white cursor-not-allowed"
          >
            <Spinner color="white" size={16} />
          </button> 
        : 
          <button
            onClick={sendMails}
            className="btn-primary"
          >
            Send Emails
          </button>
        }
      </div>
    </section>
  )
}

export default EmailsTab