export default function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
        selected ? 'chip-selected' : ''
      }`}
    >
      {children}
    </button>
  )
}
