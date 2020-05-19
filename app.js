//app.js
var express = require('express');
var app = express();
var server = require('http').Server(app);
 
require('./player')

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
 
server.listen(5000);
console.log("Server started.");
 

var Rooms = function(sid,socket){
    var self = {
        id:sid,
        sockets: [socket]
    }
    self.isFull = function(){
        return self.sockets.length > 2;
    }
    return self
}
var SOCKET_LIST = {};
var ROOMS_LIST = {};

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket){
    console.log('socket connect');
    var gameID = Math.round(Math.random()*10000).toString()
    for(var i in ROOMS_LIST){
        if(!ROOMS_LIST[i].isFull()){
            gameID = i;
            break;
        }
    }
    SOCKET_LIST[socket.id] = socket;    
    Player.onConnect(socket,gameID);
    var data = {
        socket:socket.id, 
        game:gameID
    }
    SOCKET_LIST[socket.id].emit('initial', data);
    socket.on('room',function(room){
        //console.log('1',gameID);
        //console.log(ROOMS_LIST[gameID])
        socket.join(room);
        if(ROOMS_LIST[gameID] === undefined){
            ROOMS_LIST[gameID] = Rooms(gameID,socket);
            console.log('test');
        } else{
            ROOMS_LIST[gameID].sockets.push(socket);
        }
    });


    socket.on('disconnect',function(){
        console.log('socket disconnect');
        delete SOCKET_LIST[socket.id];
        index = ROOMS_LIST[Player.list[socket.id].gameid].sockets.indexOf(socket);
        if(index != -1) ROOMS_LIST[Player.list[socket.id].gameid].sockets.splice(index,1);
        Player.onDisconnect(socket);
    });
});

 
setInterval(function(){
    var pack = {
        player:Player.update()
    }
    
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        //console.log(ROOMS_LIST);
        //console.log('1',Player.list[i].gameid.toString());
        //console.log(io.sockets.in(Player.list[i].gameid.toString()).rooms);
        io.sockets.in(Player.list[i].gameid.toString()).emit('newPositions',pack);
    }
},1000/25);