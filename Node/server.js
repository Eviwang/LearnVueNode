let http = require("http");
let route = require("./route.js");

let server = http.createServer(route).listen(5000);

server.on("listening",function(){
    console.log("linstening 5000");
})