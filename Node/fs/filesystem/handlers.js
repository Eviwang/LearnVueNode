var fs = require("fs");
var path = require("path");
var handlers = {};

handlers.index = {
    home:function(req,res){
        res.write("home");
        res.end();
    }
}


handlers.staticFile = function(req,res){
    var filePath = path.resolve(__dirname,"."+req.url);
    console.log(filePath);
    fs.readFile(filePath,(err,data)=>{
        if(err){
            res.writeHead(404);
            res.end();
        }
        res.writeHead(200,{
            "content-type":"text/plain"
        });
        res.end(data);
    });    
}


handlers.index.files = function(req,res){
    var dir = "./";
    var files = fs.readdirSync(dir);

    var data = files.map((fileName,index)=>{
        let p = path.resolve(__dirname,dir,fileName);
        var stat = fs.statSync(p);

        return {
            id:index + 1,
            name:fileName,
            modifyDate:stat.mtime
        }
    });
    res.writeHead(200,{
        "content-type":"json"
    });
    res.end(Buffer.from(JSON.stringify(data)));
}


module.exports = handlers;