// Les styles (dégradé, halo lumineux) vivent dans index.css (.btn-*), pour garder un
// seul endroit où ajuster le look de tous les boutons.
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'btn inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
