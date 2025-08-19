function RecordingHeader({ record, onPlay }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <PlayButton onClick={() => onPlay(record.r_id)} />
        <div>
          <span className="text-sm font-medium text-400">{record.r_name}</span>
        </div>
      </div>
      <span className="text-xs text-300">{record.duration}</span>
    </div>
  );
}