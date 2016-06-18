var engine = require('engine.io');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var server = engine.attach(http);

var NUMBER_OF_SENDS = 100;
var INTERVAL_TIME = 32;

app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendFile('/public/index.html', {root: __dirname});
});

server.on('connection', function(socket) {
  console.log('a user connected');

  createSampleSender(socket);
});

http.listen(8080, function(){
  console.log('listening on *:8080');
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
    socket.send('sample ' + Date.now());
}

function sendFinished(socket) {
    socket.send('finished');
}
