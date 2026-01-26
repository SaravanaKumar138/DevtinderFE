import { io } from "socket.io-client";
import { url } from "./constants";

const createSocketConnection = (userId) => {
  // 1. Define the options object with the query
  const options = {
    query: { userId },
  };

  if (location.hostname === "localhost") {
    // 2. Pass options for localhost
    return io(url, options);
  } else {
    // 3. Merge query with your production path
    return io("/", {
      ...options,
      path: "/api/socket.io",
    });
  }
};

export default createSocketConnection;
