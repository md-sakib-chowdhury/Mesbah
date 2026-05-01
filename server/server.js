const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// CORS এবং Socket.io কনফিগারেশন আপডেট করা হয়েছে
const io = new Server(server, {
  cors: {
    origin: ["https://vercel.app", "http://localhost:3000"],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: ["https://vercel.app", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());

// আপনার রুটগুলো
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/listings', require('./src/routes/listings'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/settings', require('./src/routes/settings'));
app.use('/api/upload', require('./src/routes/upload'));
app.use('/api/areas', require('./src/routes/areas'));
app.use('/api/messages', require('./src/routes/messages'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const onlineUsers = {};
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    onlineUsers[userId] = socket.id;
    socket.userId = userId;
  });

  socket.on('sendMessage', async (data) => {
    const { to, from, text } = data;
    const Message = require('./src/models/Message');
    const msg = await Message.create({ from, to, text });
    if (onlineUsers[to]) io.to(onlineUsers[to]).emit('newMessage', msg);
    socket.emit('newMessage', msg);
  });

  socket.on('disconnect', () => {
    if (socket.userId) delete onlineUsers[socket.userId];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));