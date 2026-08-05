const SIZES = {
  md: 'h-14 w-14',
  lg: 'h-24 w-24',
}

// Petite pousse compagne, dessinée en SVG (plutôt qu'un emoji brut) pour un rendu
// plus soigné et cohérent avec l'identité turquoise/corail de l'app.
export default function Mascot({ size = 'md', bounce = false, className = '' }) {
  return (
    <div
      className={`${SIZES[size]} ${className}`}
      style={bounce ? { animation: 'mascotBounce 2.6s ease-in-out infinite' } : undefined}
      aria-hidden="true"
    >
      <style>{`
        @keyframes mascotBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-2deg); }
        }
      `}</style>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <linearGradient id="mascotBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-teal-200)" />
            <stop offset="100%" stopColor="var(--color-teal-400)" />
          </linearGradient>
        </defs>

        {/* corps */}
        <circle cx="50" cy="56" r="34" fill="url(#mascotBody)" />

        {/* feuilles */}
        <path
          d="M50 24c-8 2-14 10-12 20 8 0 16-6 18-14 1-3 0-5-6-6z"
          fill="var(--color-teal-500)"
        />
        <path
          d="M50 24c8 2 14 10 12 20-8 0-16-6-18-14-1-3 0-5 6-6z"
          fill="var(--color-teal-600)"
        />

        {/* joues */}
        <circle cx="35" cy="60" r="5" fill="var(--color-coral-300)" opacity="0.6" />
        <circle cx="65" cy="60" r="5" fill="var(--color-coral-300)" opacity="0.6" />

        {/* yeux */}
        <circle cx="40" cy="54" r="3.2" fill="var(--color-navy-900)" />
        <circle cx="60" cy="54" r="3.2" fill="var(--color-navy-900)" />

        {/* sourire */}
        <path
          d="M42 64c3 4 13 4 16 0"
          stroke="var(--color-navy-900)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}
