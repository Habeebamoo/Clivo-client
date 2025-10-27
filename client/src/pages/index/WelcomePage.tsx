import { useState } from "react"
import Header from "../../components/Header"
import PhotoGrid from "../../components/PhotoGrid"

const Home = () => {
  const [email, setEmail] = useState<string>("")

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    alert(email)
  }

  return (
    <>
      <Header />

      {/* Hero section */}
      <div className="mt-18 pt-10 px-4">
        <h1 className="md:text-center font-inter text-3xl font-inter">Where <span className="text-secondary">Simple Stories</span> Find Their Voices.</h1>
        <p className="text-accent font-exo mt-3 mb-10 max-sm:mb-15 text-sm lg:mx-auto md:text-center lg:w-[50%]">Clivo is a platform for writers who demands excellence | Craft, Publish, and share your stories with a community that values quality</p>
        <PhotoGrid />
      </div>

      {/* Subscription Section */}
      <div className="mt-20 mb-10 p-4">
        <h1 className="text-center font-inter text-3xl font-inter">Stay <span className="text-secondary">Inspired.</span></h1>
        <p className="text-sm font-exo text-center text-accent mt-2 lg:mx-auto md:text-center lg:w-[50%]">Join our community of discerning readers and receive carefully selected stories, writing insights, and exclusive content delivered to your inbox.</p>
        <form onSubmit={subscribe} className="mt-4 px-5 relative sm:w-[400px] mx-auto">
          <input 
            type="email" 
            className="border-1 border-accent p-3 rounded-xl w-full text-sm placeholder:text-accent pr-27 focus:outline-none"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn-primary text-sm font-exo absolute right-[30px] top-[8px]">Subscribe</button>
        </form>
      </div>
    </>
  )
}

export default Home