import { IoCheckmarkCircle } from "react-icons/io5"
import { MdCancel } from "react-icons/md"
import { motion } from "framer-motion"
import { alertVariant } from "../utils/animation"

interface Props {
  status: "success" | "error",  
  text: string
}

const Alert = ({ status, text }: Props) => {
  const icon = status === "success" 
  ? 
    <IoCheckmarkCircle color="green" size={24} /> 
  : 
    <MdCancel color="red" size={24} />

  return (
    <div className="bg-black/40 fixed top-0 left-0 right-0 bottom-0 z-30 flex justify-center items-start">
      <motion.div 
        initial="hidden" 
        animate="show" 
        variants={alertVariant} 
        className="bg-white rounded-md max-sm:max-w-[90%] mt-10 mx-auto py-3 pl-3 pr-4 flex-start gap-2"
      >
        {icon}
        <p className="font-outfit">{text}</p>
      </motion.div>
    </div>
  )
}

export default Alert