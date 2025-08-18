import io from "socket.io-client";

const SOCKET_URL = `http://localhost:8080`;
// const SOCKET_URL = `https://kwmkqg1t-8080.euw.devtunnels.ms`;
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  query: {
    telegram_id: localStorage.getItem("telegram_id"),
  },
});

export default socket;
