const userSockets = new Map();
const courierSockets = new Map();

class Socket {
  async connect(io) {
    io.on("connection", (socket) => {
      const { telegram_id, courier_id } = socket.handshake.query;

      if (telegram_id) {
        userSockets.set(telegram_id, socket.id);
        console.log(`User ${telegram_id} socketga ulandi`);
      }

      if (courier_id) {
        courierSockets.set(courier_id, socket.id);
        console.log(`Kuryer ${courier_id} socketga ulandi`);
      }

      socket.on("users", () => {
        socket.emit("users", Array.from(userSockets.keys()));
      });

      socket.on("couriers", () => {
        socket.emit("couriers", Array.from(courierSockets.keys()));
      });

      socket.on("disconnect", () => {
        if (telegram_id) {
          userSockets.delete(telegram_id);
          console.log(`User ${telegram_id} socketdan chiqdi`);
        }
        if (courier_id) {
          courierSockets.delete(courier_id);
          console.log(`Kuryer ${courier_id} socketdan chiqdi`);
        }
      });
    });
  }

  sendToUser(io, telegram_id, event, data) {
    const socketId = userSockets.get(telegram_id);
    if (socketId) {
      io.to(socketId).emit(event, data);
    }
  }

  sendToCourier(io, courier_id, event, data) {
    const socketId = courierSockets.get(courier_id);
    if (socketId) {
      io.to(socketId).emit(event, data);
    }
  }
}

module.exports = new Socket();
