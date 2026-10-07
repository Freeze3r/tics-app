export default function ProgressDots({ total, current }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`Étape ${current + 1} sur ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current
              ? 'w-7 bg-linear-to-r from-neon-400 to-coral-400 shadow-[0_0_12px_rgba(31,209,191,0.7)]'
              : i < current
                ? 'w-1.5 bg-neon-400/80'
                : 'w-1.5 bg-teal-500/25 dark:bg-white/15'
          }`}
        />
      ))}
    </div>
  )
}
