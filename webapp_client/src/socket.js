import io from "socket.io-client";

// const SOCKET_URL = `http://localhost:8080`;
const SOCKET_URL = `https://bimserver.richman.uz`;
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  query: {
    telegram_id: localStorage.getItem("telegram_id"),
  },
});

export default socket;
