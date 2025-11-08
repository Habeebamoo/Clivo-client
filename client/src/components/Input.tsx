interface Props {
  type: string,
  placeholder?: string,
  color?: string
}

const Input = ({ type, placeholder, color }: Props) => {
  return (
    <input 
      type={type} 
      className={`${color} border-b-1 border-b-accentLight focus:outline-none w-full py-1 font-inter placeholder:text-accentLight`}
      required
      placeholder={placeholder}
    />
  )
}

export default Input