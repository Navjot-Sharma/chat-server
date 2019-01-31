const express = require("express");

const defaultRoute = require('./routes/default');

const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('views'));
// app.use(io);


const port = process.env.port || 3000;

app.use('', defaultRoute);


io.on('connection', (socket) => console.log('User connected', socket));

app.listen(port, () => console.log("listening on port ", port));
