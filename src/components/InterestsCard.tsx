import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { MdCancel } from "react-icons/md"

interface PropsType {
  interests: string[],
  setInterests: React.Dispatch<React.SetStateAction<string[]>>,
  placeholder: string
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

const interestsArray: string[] = [
  "Programming", "Software Developement", "Cybersecurity", "Artificial Intelligence", "Gaming", "Cloud Computing", "Graphics Design", "Photography", "Music", "Animation", "Fashion", "Science", "History", "Psychology", "Maths", "Career", "Entrepreneurship", "Investment", "Finance", "E-commerce", "Real Estate", "Travel", "Food & Cooking", "Relationships", "Fitness", "Culture", "Wildlife", "Politics", "Religion", "Sports", "Movies", "Anime"
];

const InterestsCard = ({ interests, setInterests, placeholder }: PropsType) => {
  const [query, setQuery] = useState<string>("")
  const [searchResult, setSearchResults] = useState<string[]>([])

  useEffect(() => {
    if (query == "") {
      setSearchResults([])
    }
  }, [query])

  const addInterest = (text: string) => {
    if (interests.length < 3) {
      setInterests(prev => ([...prev, text]))
    }
  }

  const removeInterests = (text: string) => {
    setInterests(interests.filter(val => val !== text))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const queryText = e.target.value;
    setQuery(queryText.toLowerCase());

    const matchingQueryText = interestsArray.filter(text => text.toLowerCase().includes(query) && !interests.includes(text))

    setSearchResults(matchingQueryText)
  }

  return (
    <div className="mb-8 bg-mutedLight border-1 font-outfit border-muted rounded-lg p-3">
      {/* selected interests */}
      <div className="flex-start gap-2 flex-wrap">
        {interests.map((text) => {
          return <InterestBadge text={text} remove={removeInterests} />
        })}
        
      </div>

      {/* search interest */}
      <div className="mt-4">
        <div className="relative">
          <input 
            type="search" 
            className="border-1 bg-white border-accentLight rounded-full pl-8 focus:outline-none text-sm py-2 placeholder:text-accentLight w-full" 
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
          />
          <div className="absolute left-[13px] top-[12px]">
            <FaSearch size={14} />
          </div>
        </div>

        {/* search results */}
        <div className="mt-2">
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
  )
}

export default InterestsCard