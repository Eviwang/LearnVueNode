var http = require("http");
var fs = require("fs");
var cp = require("child_process");
var opn = require("opn");

var options = {
    hostname:'www.baidu.com',
    method:'GET'
}
var request = http.request(options,function(res){
    //res.setEncoding("utf8");
    var buf = [];
    res.on("data",function(chunk){
        buf = buf.concat(chunk);        
    });
    res.on("end",function(){
        fs.exists("test.html",function(isexist){
            let doFunc = ()=>{
                 cp.exec("notepad test.html");
                 //opn("test.html");
            }
            if(!isexist){
                fs.writeFile("test.html",buf,function(){
                   doFunc();
                });
            }else{
                 doFunc();
            }
        })
        
    })
});
request.end();