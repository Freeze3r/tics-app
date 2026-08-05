export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-coral-500 text-white hover:bg-coral-600',
    secondary: 'bg-sage-100 text-sage-700 hover:bg-sage-200',
    ghost: 'text-sage-600 hover:bg-sage-100',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
