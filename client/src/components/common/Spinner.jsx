// A simple centered loading spinner
// size prop lets us use it small (inside buttons) or large (full page)
const Spinner = ({ size = 'large' }) => {
  if (size === 'large') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          {/* Spinning circle made with CSS border trick */}
          <div
            className="w-12 h-12 rounded-full border-4 border-gray-200 animate-spin"
            style={{ borderTopColor: 'var(--color-forest-600)' }}
          />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Small spinner — used inside buttons
  return (
    <div
      className="w-5 h-5 rounded-full border-2 border-white/30 animate-spin inline-block"
      style={{ borderTopColor: 'white' }}
    />
  )
}

export default Spinner