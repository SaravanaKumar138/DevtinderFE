import React from "react";
import { Link } from "react-router-dom";

const ConnectionCard = ({ connection }) => {
  // Destructure properties from the connection object
  const { firstName, lastName, photoUrl, gender, age, about } = connection;

  // Combine first and last name, handling potential nulls
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();

  return (
    // Outer container: Set width, center with mx-auto, dark background, rounded corners, padding
    <div className="w-full md:w-1/2 mx-auto my-4 p-4 rounded-xl bg-gray-800 shadow-lg flex items-center space-x-6">
      {/* Profile Image Container */}
      <div className="flex-shrink-0">
        <img
          // The image in the example is a rounded square or circle.
          src={photoUrl || "default_avatar.png"} // Add a fallback for the photoUrl
          alt={`${fullName}'s profile`}
          className="h-28 w-28 object-cover rounded-full border-4 border-gray-600"
        />
      </div>

      {/* Details Container */}
      <div className="flex-1 min-w-0">
        {/* Full Name - Larger, bold font */}
        <h1 className="text-2xl font-bold text-white mb-2">{fullName}</h1>

        {/* Info lines - Consistent smaller font, lighter text for secondary info */}
        {gender && (
          <p className="text-base text-gray-300">
            <span className="font-semibold">Gender:</span> {gender}
          </p>
        )}

        {age && (
          <p className="text-base text-gray-300">
            <span className="font-semibold">Age:</span> {age}
          </p>
        )}

        {/* 'About' or 'Profession' line - Slightly more emphasis */}
        {about && (
          <p className="text-lg font-medium text-gray-100 mt-1 mb-3">{about}</p>
        )}

        {/* Chat Button */}
        <Link to={`/chat/${connection._id}`} state={{ connection }}>
          {/* Button style matching the image's blue/purple tone (btn-primary is good) */}
          <button className="btn btn-primary text-sm px-4 py-2 mt-2">
            Chat
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ConnectionCard;
