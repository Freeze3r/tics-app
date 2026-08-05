const SIZES = {
  md: 'h-14 w-14 text-2xl',
  lg: 'h-20 w-20 text-4xl',
}

export default function Mascot({ size = 'md', bounce = false, className = '' }) {
  return (
    <div
      className={`flex ${SIZES[size]} items-center justify-center rounded-full bg-gradient-to-br from-teal-200 to-coral-100 shadow-sm dark:from-teal-700 dark:to-coral-500/20 ${className}`}
      style={bounce ? { animation: 'mascotBounce 2.4s ease-in-out infinite' } : undefined}
      aria-hidden="true"
    >
      🌿
      <style>{`
        @keyframes mascotBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
