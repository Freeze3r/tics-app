export default function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors duration-150 ${
        selected
          ? 'border-coral-500 bg-coral-100/60 text-coral-600 dark:bg-coral-500/10 dark:text-coral-300'
          : 'border-sage-200 text-ink-800/70 hover:border-sage-300 dark:border-sage-700 dark:text-sand-100/70'
      }`}
    >
      {children}
    </button>
  )
}
