import React from 'react'

const GreenTick = ({handleSendRequest}) => {
  return (
    <div>
      <button
        className="w-1/2 py-3 rounded-xl 
        bg-red-500/20 text-red-400 
        hover:bg-red-500/30 transition font-semibold"
        onClick={() => handleSendRequest("interested", user._id)}
      >
        ❌ Ignore
      </button>
    </div>
  );
}

export default GreenTick
