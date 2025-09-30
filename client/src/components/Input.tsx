interface Props {
  type: string,
}

const Input = ({ type }: Props) => {
  return (
    <input 
      type={type} 
      className="border-1 border-accentLight rounded-lg focus:outline-none w-full py-2 px-3 font-inter"
    />
  )
}

export default Input