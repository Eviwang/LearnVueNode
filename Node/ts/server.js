"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var server = http.createServer(function (req, res) {
    res.write("hello");
    res.end();
}).listen(5000);
//# sourceMappingURL=server.js.map