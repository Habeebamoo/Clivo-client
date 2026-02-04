interface Props {
  text: string,
  action: () => void,
  img?: string,
  imgClass?: string,
}

const Button = ({ text, action, img, imgClass }: Props) => {
  return (
    <button 
      onClick={action}
      className="btn-primary py-2 px-4 text-sm font-inter flex-center gap-2">
      <img src={img} className={imgClass} />
      {text}
    </button>
  )
}

export default Button