import Image from "next/image";
import nature from "@/public/nature.jpeg";
import commercial from "@/public/commercial.jpeg";
import literature from "@/public/literature.jpeg";
import tech from "@/public/tech.jpeg";
import telephone from "@/public/telephone.jpeg";
import chefs from "@/public/chefs.jpeg";

const PhotoGrid = () => {
  return (
    <div className="w-[90%] sm:w-100 mx-auto">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-2 justify-center">
          <Image
            src={commercial}
            alt="commercial"
            className="aspect-square object-cover w-full rounded-tl-lg"
            loading="lazy"
          />
          <Image
            src={nature}
            alt="nature"
            className="aspect-square object-cover w-full rounded-bl-lg"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Image
            src={chefs}
            alt="chefs"
            className="aspect-square object-cover w-full rounded-t-lg"
            loading="lazy"
          />
          <Image
            src={tech}
            alt="tech"
            className="object-cover w-full rounded-b-lg"
            style={{ aspectRatio: "1 / 2" }}
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <Image
            src={telephone}
            alt="telephone"
            className="aspect-square object-cover w-full rounded-tr-lg"
            loading="lazy"
          />
          <Image
            src={literature}
            alt="literature"
            className="aspect-square object-cover w-full rounded-br-lg"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoGrid;
