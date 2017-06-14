var crypto = require('crypto')
    ,fs = require('fs');

var privatePem = fs.readFileSync('./client.key');
var publicPem = fs.readFileSync('./client.pem');
var key = privatePem.toString();
var pubkey = publicPem.toString();
var data = "cdss";
//加密
var sign = crypto.createSign('RSA-SHA256');
sign.update(data);
var sig = sign.sign(key, 'hex');
console.log(sig);
//解密
var verify = crypto.createVerify('RSA-SHA256');
verify.update(data);


console.log(verify.verify(pubkey, sig, 'hex'));