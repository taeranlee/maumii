function MessageBubble({ message, t_talker, time }) {
  return (
    <div className={`flex items-end gap-2 mb-4 ${t_talker ? 'flex-row-reverse' : 'flex-row'}`}>
      <BearAvatar t_talker={t_talker} />
      <div className={`flex flex-col ${t_talker ? 'items-end' : 'items-start'}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-3xl relative ${
          isUser 
            ? 'bg-yellow-100 text-gray-800' 
            : 'bg-orange-100 text-gray-800'
        }`}>
          <p className="text-sm leading-relaxed">{message}</p>
          {!isUser && (
            <div className="absolute top-3 -right-2">
              <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">?</span>
              </div>
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500 mt-1 px-1">{time}</span>
      </div>
    </div>
  );
}