import React from 'react'

const RedCross = ({handleSendRequest}) => {
  return (
    <div>
      <button
        className="w-1/2 py-3 rounded-xl 
        bg-indigo-500/20 text-indigo-400 
        hover:bg-indigo-500/30 transition font-semibold"
        onClick={() => handleSendRequest("ignored", user._id)}
      >
        ❤️ Interested
      </button>
    </div>
  );
}

export default RedCross
