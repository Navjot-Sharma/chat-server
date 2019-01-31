const express = require("express");
const http = require('http');

const app = express();

const server = http.createServer(app);
const io = require('socket.io').listen(server);

const defaultRoute = require('./routes/default');

app.use(express.static('views'));

const port = process.env.port || 3000;

io.on('connection', (socket) => {
  console.log('user connected', socket.id);
  socket.on('disconnect', () => console.log('disconnected'));
  socket.on('chat message', (message) => {
    socket.broadcast.emit('chat message', message)
  });
});

app.use('', defaultRoute);

server.listen(port, () => console.log("listening on port ", port));
