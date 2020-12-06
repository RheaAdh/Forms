let io: any;

const Socket = {
  init: (server: any) => {
    io = require("socket.io")(server, {
      cors: { origin: "*", credentials: true },
    });
    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!!");
    }
    return io;
  },
};

export default Socket;
