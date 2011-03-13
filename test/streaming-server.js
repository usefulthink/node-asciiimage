var util=require('util'),
    fs=require('fs'),
    http = require('http'),  
    io = require('socket.io');

var dir=__dirname+'/video';
var files=fs.readdirSync(dir);
var frames=[];

util.log('caching frames');
files.forEach(function(file,idx) {
  var id = parseInt(file.match(/([0-9]+)\.txt$/)[1], 10);
  frames[id] = fs.readFileSync(dir + '/' + file).toString('ascii');
});

util.log(files.length + ' frames cached');
util.log('starting http- and socket.io-server on port 23042');

var server = http.createServer(function(req, res){ 
 // your normal server code 
 res.writeHead(200, {'Content-Type': 'text/html'}); 
 res.end(fs.readFileSync(__dirname + '/test.html').toString('utf8')); 
});
server.listen(23042);

// socket.io 
var socket = io.listen(server); 
var numClients = 0;

socket.on('connection', function(client){ 
  var timer=null;
  var frameIndex=0;
  var clientId=++numClients;
  
  util.log("client " + clientId + " connected: " + client);

  client.on('message', function(msg) {
    util.log('message from client: "' + msg + '"... ignoring');
  });
  
  client.on('disconnect', function() {
    util.log('client ' + clientId + ' disconnected: ' + client);
  });

  function sendNextFrame() {
//    util.puts("sending frame " + frameIndex);
    client.send(frames[(frameIndex++)]);

    frameIndex = frameIndex % frames.length;
  }
  
  util.log('start streaming for client ' + clientId);
  timer=setInterval(sendNextFrame, 50);
});

// vim: ts=2 sw=2 expandtab
