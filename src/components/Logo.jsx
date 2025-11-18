const Logo = ({ className = "w-32 h-12" }) => {
  return (
    <div className={`${className} flex items-center`}>
      <h1 className="text-white font-bold text-2xl md:text-3xl tracking-wide">
        <span className="font-extrabold">Lakopi</span>
      </h1>
    </div>
  )
}

export default Logo
