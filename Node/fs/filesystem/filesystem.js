var fs = require("fs");
let path = require("path");
let http = require("http");

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


http.createServer((req,res)=>{    
    res.writeHead(200,{
        "content-type":"json"
    });
    res.write(Buffer.from(JSON.stringify(data)));
    res.end();
}).listen(5000);