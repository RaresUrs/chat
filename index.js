var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat');

//Checking conetivity to DB
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to Database...');
});

// Chat schema
var chatSchema = mongoose.Schema({
    massage: String,
    created: {
        type: Date,
        default: Date.now
    }
})

//Chat model
var chat = mongoose.model('Message', chatSchema);

// Getting the message value
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

    socket.on('chat message', function(msg) {
        var message = new chat({
            'massage': msg
        });

        message.save(function(err) {
            if (err)
                return console.error(err);
        });
        io.emit('chat message', msg);
    });
});

http.listen(5657, function() {
    console.log('Server Started');
});
