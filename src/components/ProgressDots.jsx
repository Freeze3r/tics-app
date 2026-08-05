export default function ProgressDots({ total, current }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`Étape ${current + 1} sur ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current ? 'w-6 bg-coral-500' : i < current ? 'w-1.5 bg-sage-400' : 'w-1.5 bg-sage-200'
          }`}
        />
      ))}
    </div>
  )
}
