var WebSocketServer = require("ws").Server;


var wss = new WebSocketServer({ port: 8181 });
wss.on('connection', function (ws) {
    console.log('client connected');
    ws.on('message', function (message) {
        console.log(message);
    });

    setInterval(()=>{
        ws.send("fuck");
    },1000);
    
});