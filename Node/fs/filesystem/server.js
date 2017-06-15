let http = require("http");
let fs = require("fs");
let handlers = require("./handlers.js");
let path = require("path");

http.createServer((req,res)=>{    
    var segs = req.url.split("/");
    var controller = segs[1];
    var action = segs[2];
    if(req.url == "/"){
        fs.readFile("./index.html",function(err,data){
            res.writeHead(200,{
                "content-type":"text/html"
            });
            res.write(data);
            res.end();
        });
    }else if(req.url.indexOf(".")>-1){
        handlers.staticFile.call(null,req,res);
    }else{
        handlers[controller][action].call(null,req,res);
    }


}).listen(5000);