var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users = [];
var MAX = 4;
var drawer;
var guesser;

io.on('connection', function(socket) {
   console.log('User connected. Waiting for other users...');
   
   if (users.length < MAX) {
       users.push(socket);
       if (users.length == MAX) {
           drawer = Math.floor(Math.random() * MAX);
           users[drawer].emit('role', 'drawer');
       }
   } else {
       socket.emit('reject');
       socket.disconnect();
       console.log('User attempted to connect but denied.');
   }
   
   socket.on('drawer', function(position) {
       console.log('Somebody is drawing.');
       console.log(position);
       socket.broadcast.emit('draw', position);
   });
   
   socket.on('guesses', function(guessBox) {
       console.log('Somebody submitted a guess.');
       socket.broadcast.emit('Somebody guessed.');
       
   });
});

server.listen(process.env.PORT || 8080);