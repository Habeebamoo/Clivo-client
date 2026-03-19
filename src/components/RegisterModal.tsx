import { useNavigate } from "react-router";
import logo from "../assets/logo2.png";
import { LuArrowUpRight } from "react-icons/lu";
import { motion } from "framer-motion";
import { slideDown } from "../utils/animation";

const RegisterModal = () => {
  const navigate = useNavigate();

  const toSignIn = () => {
    navigate("/signin");
  }

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/80 flex-center">
      <motion.div 
        initial="hidden"
        animate="show"
        variants={slideDown}
        className="bg-white rounded-lg p-6 w-[90%] sm:w-100"
      >
        <div className="flex-center">
          <img src={logo} className="h-8 md:h-12" />
        </div>

        <h2 className="text-2xl md:text-3xl font-outfit text-center mt-4">Join Clivo</h2>
        <p className="text-sm text-gray-600 font-jsl text-center mt-2">
          Create an account to discover and share amazing content.
        </p>

        <button
          onClick={toSignIn}
          className="btn-primary flex-center gap-3 w-full mt-6 py-3"
        >
          <span>Sign Up</span>
          <LuArrowUpRight />
        </button>
      </motion.div>
    </div>
  )
}

export default RegisterModal