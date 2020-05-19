Player = function(sid,gid){
    var self = {
        x:1,
        y:1,
        id:sid,
        pRight:false,
        pLeft:false,
        pUp:false,
        pDown:false,
        pMouse:false,
        angMouse:0,
        rl:false,
        rr:false,
        au:false,
        ad:false,
        vel:7,
        rvel:3.5,
        avel:.01,
        angle:45,
        alt:0.8,
        mapId:0,
        imgId:0,
        gameid:gid
    }
    var super_update = self.update;
    self.update = function(){
        if(self.pRight){
            self.x += self.vel;
        }
        if(self.pLeft){
            self.x -= self.vel;
        }
        if(self.pDown){
            self.y += self.vel;
        }
        if(self.pUp){
            self.y -= self.vel;
        }
    }
    Player.list[self.id] = self;
    return self;
}
Player.list = {};
Player.onConnect = function(socket,gameid){
        var player = Player(socket.id,gameid);
        socket.on('keyPress',function(data){
        if(data.inputID === 'r'){
            player.pRight = data.state;
        }
        if(data.inputID === 'l'){
            player.pLeft = data.state;
        }
        if(data.inputID === 'd'){
            player.pDown = data.state;
        }
        if(data.inputID === 'u'){
            player.pUp = data.state;
        }
        if(data.inputID === 'rl'){
            player.rl = data.state;
        }
        if(data.inputID === 'rr'){
            player.rr = data.state;
        }
        if(data.inputID === 'au'){
            player.au = data.state;
        }
        if(data.inputID === 'ad'){
            player.ad = data.state;
        }
        if(data.inputID === 'fire'){
            player.pMouse = data.state;
        }
        if(data.inputID === 'ang'){
            player.angMouse = data.state;
        }
    });
} 
Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
}

var lastUpdatetime = (new Date()).getTime();
Player.update = function(){
    var currentTime = (new Date()).getTime();
    var tDiff = currentTime - lastUpdatetime;
    for(var i in Player.list){
        Player.list[i].update(tDiff);
    }
    lastUpdatetime = currentTime;
    return Player.list;
}