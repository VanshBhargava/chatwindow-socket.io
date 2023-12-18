const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Keep track of connected users
const users = {};

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected');

  // Ask for the username
  socket.on('set username', (username) => {
    users[socket.id] = username;
    // Broadcast when a user joins
    io.emit('chat message', `${username} has joined the chat`);
  });

  // Listen for messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${users[socket.id]}`);
    // Broadcast when a user disconnects
    io.emit('chat message', `${users[socket.id]} has left the chat`);
    delete users[socket.id];
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
