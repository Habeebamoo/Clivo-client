interface Props {
  type: string,
  placeholder?: string,
}

const Input = ({ type, placeholder }: Props) => {
  return (
    <input 
      type={type} 
      className="border-1 border-accentLight rounded-lg focus:outline-none w-full py-2 px-3 font-inter placeholder:text-accentLight"
      required
      placeholder={placeholder}
    />
  )
}

export default Input