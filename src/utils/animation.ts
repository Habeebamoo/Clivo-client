import { type Variants } from "framer-motion";

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeInOut" } },
};

export const alertVariant: Variants = {
  hidden: { y: -40 },
  show: { y: 0, transition: { duration: 0.2, ease: "easeInOut" } }
}