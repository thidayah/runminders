export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer'
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary border border-primary',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    white: 'bg-white text-primary hover:bg-gray-100 focus:ring-white border border-white',
    'white-outline': 'border-2 border-white text-white hover:bg-white hover:text-primary focus:ring-white'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass}`
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}