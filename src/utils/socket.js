
import { io } from "socket.io-client";
import { url } from "./constants";

const createSocketConnection = () => {
    if (location.hostname === "localhost")
    return io(url);
else 
    return io("/", {path: "api/socket.io"})
}

export default createSocketConnection;