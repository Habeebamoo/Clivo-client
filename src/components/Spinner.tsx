const Spinner = ({ size, color }: { size: number, color: string }) => {
  return (
    <div 
      className={`border-4 border-${color} border-t-transparent rounded-full animate-spin`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${size * 0.15}px`
      }}></div>
  )
}

export default Spinner