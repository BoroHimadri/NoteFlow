const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const roomStates = new Map();

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    if (roomStates.has(roomId)) {
      socket.emit('initial-state', { roomId, html: roomStates.get(roomId) });
    }
  });
  socket.on('content-change', (data) => {
    if (data.roomId && data.html !== undefined) {
      roomStates.set(data.roomId, data.html);
      socket.to(data.roomId).emit('content-change', data);
    }
  });
  socket.on('sync-state', (data) => {
    if (data.roomId && data.html !== undefined) {
      roomStates.set(data.roomId, data.html);
      socket.to(data.roomId).emit('content-change', data);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
