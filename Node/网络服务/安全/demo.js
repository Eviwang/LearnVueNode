var crypto = require("crypto");

var fs = require("fs");

var privateKey = fs.readFileSync("./client.key");
var publicKey = fs.readFileSync("./client.pem");

console.log(publicKey.toString());
var encodeData = crypto.publicEncrypt(publicKey.toString(),new Buffer("test")).toString("base64");

console.log(encodeData);

var decodeData = crypto.privateDecrypt(privateKey.toString(),new Buffer(encodeData,"base64"));

console.log(decodeData.toString());

