interface Props {
  type: string;
  placeholder?: string;
  name?: string;
  color?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ type, placeholder, name, color, value, onChange }: Props) => {
  return (
    <input
      type={type}
      name={name}
      className={`${color ?? ""} border-b border-b-accentLight focus:outline-none w-full py-1 font-inter placeholder:text-accentLight dark:text-stone-400`}
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
