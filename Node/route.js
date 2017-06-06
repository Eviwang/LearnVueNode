const url = require("url");
const handlers = require("./handlers.js");

console.log(handlers);

function route(req,res){
    var pathName = url.parse(req.url).pathname;
    var paths = pathName.split("/");
    console.log(paths);

    var controller = paths[1] || "index";
    var method = paths[2] || "index";

    var args = paths.slice(3);

    if(handlers[controller] && handlers[controller][method]){
        handlers[controller][method].apply(null,[req,res].concat(args));
    }else{        
        res.write("404");
        res.end();
    }
}

module.exports = route;