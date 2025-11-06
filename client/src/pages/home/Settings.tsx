import { useState } from "react"
import Input from "../../components/Input"
import InterestsCard from "../../components/InterestsCard"
import { H2 } from "../../components/Typo"
import { BiSave } from "react-icons/bi"

const SettingsPage = () => {
  const [interest, setInterests] = useState<string[]>([])

  return (
    <main className="px-6">
      <H2 font="inter" text="Your Details" others="mt-25 sm:text-center" />

      <div className="sm:w-[400px] mx-auto font-outfit">
        {/* profile picture */}
        <div className="mt-10">
          <h1 className="mb-3">Profile Picture</h1>
          <div className="h-24 w-24 bg-muted border-1 border-accentLight rounded-full"></div>
        </div>

        {/* Other Details */}
        <form className="mt-8 mb-10">
          <div>
            <label htmlFor="name" className="mb-2 block">Full-Name</label>
            <Input type="text" />
          </div>

          <div className="mt-4">
            <label htmlFor="username" className="mb-2 block">Username</label>
            <Input type="text" />
          </div>

          <div className="mt-4">
            <label htmlFor="bio" className="mb-2 block">Bio</label>
            <textarea 
              name="bio" 
              rows={4} 
              className="resize-none border-1 border-accentLight rounded-lg focus:outline-none w-full py-2 px-3 font-inter" required></textarea>
          </div>

          <div className="mt-4">
            <label htmlFor="website" className="mb-2 block">Website</label>
            <Input type="url" placeholder="https://porfolio.com" />
          </div>

          {/* Interest */}
          <label htmlFor="name" className="font-exo mb-2 block mt-4">Interests</label>
          <InterestsCard 
            interests={interest} 
            setInterests={setInterests} 
            placeholder="Select Interests" 
          />

          <button className="btn-primary font-inter flex-center gap-2 text-sm">
            <BiSave />
            <span>Save Changes</span>
          </button>
        </form>

      </div>
    </main>
  )
}

export default SettingsPage