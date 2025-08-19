function PlayButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-8 h-8 bg-button-record rounded-full flex items-center justify-center transition-colors"
    >
      <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
  );
}