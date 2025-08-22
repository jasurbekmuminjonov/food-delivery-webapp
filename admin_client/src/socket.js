import io from "socket.io-client";

// const SOCKET_URL = `http://localhost:8080`;
const SOCKET_URL = `https://bimserver.richman.uz`;
const socket = io(SOCKET_URL, { transports: ["websocket"] });

export default socket;
