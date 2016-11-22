var socket = io();

var pictionary = function() {
    var canvas, context, drawing;
    var timer;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function(event) {
        drawing = true;
    });
    canvas.on('mouseup', function(event) {
        drawing = false;
    });
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        if (drawing) {
            draw(position);
            socket.emit('drawer', position);
        }
    });
    
    var guessBox;

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        //$('#guess input').text(guessBox.val());
        console.log(guessBox.val());
        guessBox.val('');
        socket.emit('guesses', guessBox);
    };
    
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
    
    function reject() {
        $('#message').text("Too many users. Sorry.");
        console.log('This game is full. Come back later.');
        //stop all interactions.
    }
    
    function remoteDraw(position) {
        if (!timer) {
            $('#message').text("User is drawing.");
            timer = window.setTimeout(function() {
                $('#message').text('');
                timer = 0;
            }, 3000);
        }
        draw(position);
    }
    
    function setRole(role) {
        if (role == 'drawer') {
            draw;
            //enable drawing on canvas
        }
        else {
            
            //role is guesser
            //disable drawing on canvas
            //enable guessing logic
        }
    }
    
    socket.on('draw', remoteDraw);
    socket.on('reject', reject);
    socket.on('role', setRole);
};

$(document).ready(function() {
    pictionary();
});