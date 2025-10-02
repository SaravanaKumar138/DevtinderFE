import React from "react";
import { Link } from "react-router-dom";

const ConnectionCard = ({ connection }) => {
  console.log(connection);
  const { firstName, lastName, photoUrl, gender, age, about } = connection;
  return (
    <>
      <div className="flex items-center w-1/2 bg-base-300 mx-auto justify-start rounded-xl m-5">
        <div>
          <img src={photoUrl} alt="" className="h-40 w-40 rounded-full m-2" />
        </div>
        <div className="ml-5">
          <h1 className="text-2xl font-semibold">
            {firstName + " " + lastName}
          </h1>
          {gender && (
            <h1 className="text-xl font-semibold">Gender: {gender}</h1>
          )}
          {age && <h1 className="text-xl font-semibold">Age: {age}</h1>}
          {about && <h1 className="text-xl font-semibold">{about}</h1>}
          <Link to={`/chat/${connection._id}`} state={{connection}}>
            <button className="btn btn-primary">Chat</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ConnectionCard;
