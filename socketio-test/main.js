var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var NUMBER_OF_SENDS = 100;
var INTERVAL_TIME = 32;

app.get('/', function(req, res){
  res.sendFile('/public/index.html', {root: __dirname});
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  createSampleSender(socket);
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

function createSampleSender(socket) {
    var intervalID;
    var count = 0;
    
    intervalID = setInterval(function() {
        if (count > NUMBER_OF_SENDS) {
            clearInterval(intervalID);
            sendFinished(socket);
            return;
        }
        
        sendSample(socket);
        count ++;
        
    }, INTERVAL_TIME);
}

function sendSample(socket) {
    socket.emit('sample', {serverTime: Date.now()});
}

function sendFinished(socket) {
    socket.emit('finished');
}