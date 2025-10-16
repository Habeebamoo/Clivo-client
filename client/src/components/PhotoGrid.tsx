import nature from "../assets/nature.jpeg"
import commercial from "../assets/commercial.jpeg"
import literature from "../assets/literature.jpeg"
import tech from "../assets/tech.jpeg"
import telephone from "../assets/telephone.jpeg"
import chefs from "../assets/chefs.jpeg"
import { memo } from "react"

const PhotoGrid = () => {
  return (
    <div className="w-[90%] sm:w-[400px] mx-auto">
      <div className="grid grid-cols-3 gap-2">

        <div className="flex flex-col gap-2 justify-center">
          <img src={commercial} className="aspect-square object-cover w-full" loading="lazy" />
          <img src={nature} className="aspect-square object-cover w-full" loading="lazy" />
        </div>

        <div className="flex flex-col gap-2">
          <img src={chefs} className="aspect-square object-cover w-full" loading="lazy" />
          <img src={tech} className="object-cover w-full" style={{ aspectRatio: "1 / 2"}} loading="lazy" />
        </div>

        <div className="flex flex-col gap-2 justify-center">
          <img src={telephone} className="aspect-square object-cover w-full" loading="lazy" />
          <img src={literature} className="aspect-square object-cover w-full" loading="lazy" />
        </div>

      </div>
    </div>
  )
}

const memoizedPhotoGrid = memo(PhotoGrid)
export default memoizedPhotoGrid