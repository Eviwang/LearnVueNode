import * as http from "http";

const server = http.createServer(function(req,res){
    res.write("hello");
    res.end();
}).listen(5000);


