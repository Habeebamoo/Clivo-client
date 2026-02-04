import { useNavigate } from "react-router";
import logo from "../assets/logo.jpg";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { User } from "../redux/reducers/user_reducer";
import { useFetchProfile } from "../hooks/useFetchProfile";
import Spinner from "./Spinner";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./Loading";

const Header = ({ type="welcome" }: { type?: "welcome" | "home" }) => {
  const { isLoading } = useFetchProfile()
  const user: User = useSelector((state: any) => state.user.profile);

  const [navActive, setNavActive] = useState<boolean>(false)
  const [loggingOut, setLoggingOut] = useState<boolean>(false)
  const navigate = useNavigate()

  console.log(user)

  const signOut = async () => {
    setLoggingOut(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        credentials: "include"
      })

      const response = await res.json()

      if (!res.ok) {
        toast.error("Something went wrong.")
        return
      }

      toast.success(response.message)
      setTimeout(() => navigate("/signin"), 2500)
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoggingOut(false)
    }
  }

  const toHome = () => {
    window.location.href = "/home"
  }

  const toLogin = () => {
    navigate("/signin")
  }

  const toggleMenu = () => {
    setNavActive(!navActive)
  }

  const toProfile = () => {
    window.location.href = "/home/profile"
  }

  const toCreate = () => {
    window.location.href = "/home/create"
  }

  return (
    <header className="py-4 px-6 sm:px-8 flex-between bg-white fixed top-0 left-0 right-0 z-20 shadow">
      <ToastContainer />
      {loggingOut && <Loading />}

      <nav className="flex-between w-full">
        <div className="flex-start gap-2">
          <img src={logo} className="h-8 rounded-sm" />
          <h1 className="text-2xl font-bold font-inter">Clivo</h1>
        </div>

        {isLoading && 
          <div>
            <Spinner color="white" size={25} />
          </div>
        }

        {/* Dynamic */}
        {!isLoading && 
          <div>
            {type === "welcome" ?
              (
                <button onClick={toLogin} className="btn-primary text-sm font-outfit px-3 py-2">Get Started</button>
              ) : (
                <div className="cursor-pointer">
                  <div onClick={toggleMenu} className="h-9 w-9 rounded-full overflow-hidden border border-accentLight">
                    <img src={user!.picture} className="w-full h-full object-cover object-center" />
                  </div>
                    {/* navbar */}
                    {navActive && 
                      <div className="fixed right-5.75 sm:right-8.25 bg-white border border-muted mt-1 text-accent w-50">
                        <div onClick={toHome} className="nav-text border-b border-b-muted ">
                          <p>Home</p>
                        </div>

                        <div onClick={toProfile} className="nav-text border-b border-b-muted">
                          <p>View Profile</p>
                        </div>

                        <div onClick={toCreate} className="nav-text border-b border-b-muted">
                          <p>Create Article</p>
                        </div>

                        <div onClick={signOut} className="nav-text">
                          <p>Sign Out</p>
                        </div>
                      </div>
                    }
                </div>
              )
            }
          </div>
        }
      </nav>
    </header>
  )
}

export default Header