function game(){
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.font = '50px serif';

  var socket = io().connect();
  var gameId = "";
  var socketId = 0;
  socket.on('initial',function(data){
    gameId=data.game;
    socketId=data.socket;
    console.log(gameId);
    socket.emit('room',gameId);
  });
     
  socket.on('newPositions',function(data){
      ctx.clearRect(0,0,1000,700);
      for(var i in data.player){
        console.log(data.player[i].gameid === gameId);
          if(data.player[i].gameid === gameId){
            ctx.fillText(gameId,data.player[i].x,data.player[i].y);  
          }
      }
  });

  document.onkeydown = function(event){
    if(event.keyCode === 68)
      socket.emit('keyPress', {inputID:'r',state:true});
    if(event.keyCode === 83)
      socket.emit('keyPress', {inputID:'d',state:true});
    if(event.keyCode === 65)
      socket.emit('keyPress', {inputID:'l',state:true});
    if(event.keyCode === 87)
      socket.emit('keyPress', {inputID:'u',state:true});
    if(event.keyCode === 81)
      socket.emit('keyPress', {inputID:'rl',state:true});
    if(event.keyCode === 69)
      socket.emit('keyPress', {inputID:'rr',state:true});
    if(event.keyCode === 38)
      socket.emit('keyPress', {inputID:'au',state:true});
    if(event.keyCode === 40)
      socket.emit('keyPress', {inputID:'ad',state:true});
  }
  document.onkeyup = function(event){
    if(event.keyCode === 68)
      socket.emit('keyPress', {inputID:'r',state:false});
    if(event.keyCode === 83)
      socket.emit('keyPress', {inputID:'d',state:false});
    if(event.keyCode === 65)
      socket.emit('keyPress', {inputID:'l',state:false});
    if(event.keyCode === 87)
      socket.emit('keyPress', {inputID:'u',state:false});
    if(event.keyCode === 81)
      socket.emit('keyPress', {inputID:'rl',state:false});
    if(event.keyCode === 69)
      socket.emit('keyPress', {inputID:'rr',state:false});
    if(event.keyCode === 38)
      socket.emit('keyPress', {inputID:'au',state:false});
    if(event.keyCode === 40)
      socket.emit('keyPress', {inputID:'ad',state:false});
  }
  document.onmousedown = function(event){
    socket.emit('keyPress',{
      inputID:'fire',
      state:true
    });
  }

  document.onmouseup = function(event) {
    socket.emit('keyPress',{
      inputID:'fire',
      state:false
    });
  }
}