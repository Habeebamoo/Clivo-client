import { useNavigate } from "react-router"
import logo from "../assets/logo.jpg"
import { useState } from "react"

const Header = ({ type="welcome" }: { type?: "welcome" | "home" }) => {
  const [navActive, setNavActive] = useState<boolean>(false)
  const navigate = useNavigate()

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

  return (
    <header className="py-4 px-6 sm:px-8 flex-between bg-white fixed top-0 left-0 right-0 z-20 shadow">
      <nav className="flex-between w-full">
        <div className="flex-start gap-2">
          <img src={logo} className="h-8 rounded-sm" />
          <h1 className="text-2xl font-bold font-inter">Clivo</h1>
        </div>

        {/* Dynamic */}
        <div>
          {type === "welcome" ?
            (
              <button onClick={toLogin} className="btn-primary text-sm font-outfit px-3 py-2">Get Started</button>
            ) : (
              <div className="cursor-pointer">
                <div onClick={toggleMenu} className="h-8 w-8 rounded-full bg-muted border-1 border-accentLight"></div>
                  {/* navbar */}
                  {navActive && 
                    <div className="fixed right-[23px] sm:right-[33px] bg-white border-1 border-muted mt-1 text-[12px] text-accent w-40">
                      <div onClick={toHome} className="nav-text border-b-1 border-b-muted ">
                        <p>Home</p>
                      </div>

                      <div onClick={toProfile} className="nav-text border-b-1 border-b-muted">
                        <p>View Profile</p>
                      </div>

                      <div className="nav-text border-b-1 border-b-muted">
                        <p>New Article</p>
                      </div>

                      <div className="nav-text">
                        <p>Sign Out</p>
                      </div>
                    </div>
                  }
              </div>
            )
          }
        </div>
      </nav>
    </header>
  )
}

export default Header