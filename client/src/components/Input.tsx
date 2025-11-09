interface Props {
  type: string,
  placeholder?: string,
  name?: string,
  color?: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = ({ type, placeholder, name, color, value, onChange }: Props) => {
  return (
    <input 
      type={type} 
      name={name}
      className={`${color} border-b-1 border-b-accentLight focus:outline-none w-full py-1 font-inter placeholder:text-accentLight`}
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}

export default Input