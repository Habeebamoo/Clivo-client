import React, { useEffect, useState } from "react"
import Input from "../../components/Input"
import { H2 } from "../../components/Typo"
import { MdCancel } from "react-icons/md"
import { FaSearch } from "react-icons/fa"
import { BiSave } from "react-icons/bi"

const interestsArray: string[] = [
  "Music", "Tech", "Anime", "Science", "Fashion", "Art", "Programming", "Medicine", "Entertainment", "Government", "Engineering", "Economy", "Artificial Intelligence", "Lifestyle", "Education", "Business", "Astrology", "Food", "Construction", "Movies", "Gaming"
];

const SettingsPage = () => {
  const [interests, setInterets] = useState<string[]>(["Movies", "Tech"])
  const [query, setQuery] = useState<string>("")
  const [searchResult, setSearchResults] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const queryText = e.target.value;
    setQuery(queryText.toLowerCase());

    const matchingQueryText = interestsArray.filter(text => text.toLowerCase().includes(query) && !interests.includes(text))

    setSearchResults(matchingQueryText)
  }

  useEffect(() => {
    if (query == "") {
      setSearchResults([])
    }
  }, [query])

  const addInterest = (text: string) => {
    if (interests.length < 3) {
      setInterets(prev => ([...prev, text]))
    }
  }

  const removeInterests = (text: string) => {
    setInterets(interests.filter(val => val !== text))
  }

  return (
    <main className="px-6">
      <H2 font="inter" text="Your Details" others="mt-25 sm:text-center" />

      <div className="sm:w-[400px] mx-auto">
        {/* profile picture */}
        <div className="mt-10">
          <h1 className="font-exo mb-3">Profile Picture</h1>
          <div className="h-24 w-24 bg-muted border-1 border-accentLight rounded-full"></div>
        </div>

        {/* Other Details */}
        <form className="mt-8 mb-10">
          <div>
            <label htmlFor="name" className="font-exo mb-2 block">Full-Name</label>
            <Input type="text" />
          </div>

          <div className="mt-4">
            <label htmlFor="username" className="font-exo mb-2 block">Username</label>
            <Input type="text" />
          </div>

          <div className="mt-4">
            <label htmlFor="bio" className="font-exo mb-2 block">Bio</label>
            <textarea 
              name="bio" 
              rows={4} 
              className="resize-none border-1 border-accentLight rounded-lg focus:outline-none w-full py-2 px-3 font-inter" required></textarea>
          </div>

          <div className="mt-4">
            <label htmlFor="website" className="font-exo mb-2 block">Website</label>
            <Input type="url" placeholder="https://porfolio.com" />
          </div>

          {/* Interest */}
          <label htmlFor="name" className="font-exo mb-2 block mt-4">Interests</label>
          <div className="mb-8 bg-mutedLight rounded-lg">
            {/* selected interests */}
            <div className="flex-start p-3 gap-2 flex-wrap">
              {interests.map((text) => {
                return <InterestBadge text={text} remove={removeInterests} />
              })}
              
            </div>

            {/* search interest */}
            <div className="py-2 pl-3">
              <div className="relative">
                <input 
                  type="search" 
                  className="border-1 bg-white border-accentLight rounded-full pl-6 focus:outline-none text-sm py-1 placeholder:text-accentLight" 
                  placeholder="Search interests"
                  value={query}
                  onChange={handleChange}
                />
                <div className="absolute left-[10px] top-[10px]">
                  <FaSearch size={10} />
                </div>
              </div>

              {/* search results */}
              <div className="mt-2 py-2">
                <div className="flex-start gap-2 flex-wrap">
                  {searchResult.map((text) => {
                    return  (
                      <div 
                        onClick={() => addInterest(text)}
                        className="py-2 px-3 bg-muted rounded-full text-sm cursor-pointer hover:bg-accentLight active:bg-accentLight">
                        {text}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

          </div>

          <button className="btn-primary font-inter flex-center gap-2 text-sm">
            <BiSave />
            <span>Save Changes</span>
          </button>
        </form>

      </div>
    </main>
  )
}

const InterestBadge = ({ text, remove }: { text: string, remove: (text: string) => void }) => {
  return (
    <div
      onClick={() => remove(text)} 
      className="py-2 px-3 bg-muted flex-center gap-2 rounded-full text-sm cursor-pointer hover:bg-accentLight active:bg-accentLight">
      <span>{text}</span>
      <MdCancel />
    </div>
  )
}

export default SettingsPage