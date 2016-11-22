var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var words = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];
var users = [];
var MAX = 4;
var drawer;
var guesser;
var drawWord;

io.on('connection', function(socket) {
   console.log('User connected. Waiting for other users...');
   
   if (users.length < MAX) {
       users.push(socket);
       if (users.length == MAX) {
           drawer = Math.floor(Math.random() * MAX);
           drawWord = Math.floor((Math.random() * words.length) + 1);
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
   
   socket.on('disconnect', function() {
       console.log('User disconnected');
   })
});

server.listen(process.env.PORT || 8080);