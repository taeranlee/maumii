function PlayButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${className}`}
    >
      <svg
        className="w-6 h-6 text-white ml-0.5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}

export default PlayButton;
