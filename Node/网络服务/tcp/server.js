

/*
var server = net.createServer(function (socket){
    socket.on("data",function(data){
        socket.write("hello");
    });

    socket.on("end",function(){
        console.log("end");
    });

    socket.write("hello world");
});

server.listen(6000,function(){
    console.log("server start");
});

*/
var net = require("net");
var server = net.createServer();
server.on("connection",function(socket){
    socket.write("welcome!");

    socket.on("data",function(data){
        console.log(data.toString());
    });
    socket.on("close",function(){
        console.log("close");
    });
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function() {
        var chunk = process.stdin.read();
        if (chunk !== null) {
            socket.write(chunk.toString());
        }
    });
});

server.on("listening",function(){
    console.log("listening...6000");
});
server.on("error",function(e){
    console.log(e);
});

server.listen(6000);