const { Server } = require("socket.io");
const http = require("http");
const { createClient } = require("@supabase/supabase-js");

const PORT = process.env.PORT || 3001;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const MAX_ROOMS = 500;
const MAX_ROOM_ID_LENGTH = 100;
const MAX_CONTENT_BYTES = 500_000;
const EVENTS_PER_WINDOW = 200;
const WINDOW_MS = 10_000;

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1_000_000,
});

const roomStates = new Map();

function setRoomState(roomId, html) {
  if (typeof html !== "string") return false;
  if (Buffer.byteLength(html, "utf8") > MAX_CONTENT_BYTES) return false;

  if (!roomStates.has(roomId) && roomStates.size >= MAX_ROOMS) {
    const oldest = roomStates.keys().next().value;
    roomStates.delete(oldest);
  }

  if (roomStates.has(roomId)) roomStates.delete(roomId);
  roomStates.set(roomId, html);
  return true;
}

function isValidPayload(data) {
  return (
    data &&
    typeof data.roomId === "string" &&
    data.roomId.length > 0 &&
    data.roomId.length <= MAX_ROOM_ID_LENGTH &&
    typeof data.html === "string"
  );
}

function withinRateLimit(socket) {
  const now = Date.now();
  if (now - socket.data.windowStart > WINDOW_MS) {
    socket.data.windowStart = now;
    socket.data.events = 0;
  }
  socket.data.events += 1;
  return socket.data.events <= EVENTS_PER_WINDOW;
}

io.use(async (socket, next) => {
  if (!supabase) return next(new Error("Server misconfigured"));
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data || !data.user) return next(new Error("Unauthorized"));

  socket.data.userId = data.user.id;
  socket.data.events = 0;
  socket.data.windowStart = Date.now();
  next();
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    if (typeof roomId !== "string" || roomId.length > MAX_ROOM_ID_LENGTH) return;
    socket.join(roomId);
    if (roomStates.has(roomId)) {
      socket.emit("initial-state", { roomId, html: roomStates.get(roomId) });
    }
  });

  socket.on("content-change", (data) => {
    if (!withinRateLimit(socket)) return;
    if (!isValidPayload(data)) return;
    if (!setRoomState(data.roomId, data.html)) return;
    socket.to(data.roomId).emit("content-change", data);
  });

  socket.on("sync-state", (data) => {
    if (!withinRateLimit(socket)) return;
    if (!isValidPayload(data)) return;
    if (!setRoomState(data.roomId, data.html)) return;
    socket.to(data.roomId).emit("content-change", data);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
