var net = require("net");
var client = net.connect({
    port:6000
    },function() {                
        var isOk = client.write("你好");
        console.log("send",isOk);
    }
);

client.on("data",function(data){
    console.log("server:"+data.toString());    
});


client.on("end",function(){
    console.log("end");
});


process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    client.write(chunk.toString());
  }
});