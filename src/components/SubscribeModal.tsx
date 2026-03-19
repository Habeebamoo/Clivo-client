import check from "../assets/checkmark.png";
import { motion } from "framer-motion";
import { slideDown } from "../utils/animation";

const SubscribeModal = () => {
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/80 flex-center z-30">
      <motion.div 
        initial="hidden" 
        animate="show" 
        variants={slideDown} 
        className="bg-white rounded-lg px-6 py-12 w-[90%] sm:w-100"
      >
        <div className="flex-center">
          <img src={check} className="h-14" />
        </div>

        <h1 className="font-outfit text-xl text-center mt-6 md:text-2xl">
          Thanks for subscribing
        </h1>

        <p className="font-jsl text-center mt-4 text-sm">
          You will now receive our newsletter with the latest stories, writing tips, and exclusive content. We’re excited to have you on board!
        </p>
      </motion.div>
    </div>
  )
}

export default SubscribeModal