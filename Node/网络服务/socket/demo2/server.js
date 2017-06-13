var http = require("http");
var crypto = require("crypto");

var server = http.createServer(function (req, res) {
    console.log("http request");
    res.writeHead(200, { 'Content-Type': "text/plain" });
    res.end("hello");
});

server.listen(5000);


server.on("upgrade", function (req, socket, upgradeHead) {
    console.log("upgrade");

    var key = req.headers["sec-websocket-key"];
    console.log(key);
    var shasum = crypto.createHash("sha1");
    key = shasum.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");

    var headers = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade:websocket",
        "Connection:Upgrade",
        "Sec-WebSocket-Accept:" + key
    ];
    socket.setNoDelay(true);

    console.log(headers.concat('', '').join('\r\n'));
    socket.write(headers.concat('', '').join('\r\n'));

    socket.on("data",function(data){
        var frame = decodeFrame(data);
        console.log(frame.Payload_data.toString());

        send(socket,"test");
    });



});


//处理掩码Buffer流(接收)
function decodeFrame(frame) {
    if (frame.length < 2) {
        return null;
    }

    var counter = 0,
        fin_offset = 7,
        opcode_offset = parseInt(1111, 2),   //15
        mask_offset = 7,
        payload_len_offset = parseInt(1111111, 2),   //127
        FIN ,
        Opcode ,
        MASK ,
        Payload_len,
        buffer,
        Masking_key,
        i,
        j;

    FIN = frame[counter] >> fin_offset;

    Opcode = frame[counter++] & opcode_offset;
    MASK = frame[counter] >> mask_offset;
    Payload_len = frame[counter++] & payload_len_offset;
    Payload_len === 126 && (Payload_len = frame.readUInt16BE(counter)) && (counter += 2);
    Payload_len === 127 && (Payload_len = frame.readUInt32BE(counter + 4)) && (counter += 8);

    buffer = new Buffer(Payload_len);
    if (MASK) {
        Masking_key = frame.slice(counter, counter + 4);
        counter += 4;
        for (i = 0; i < Payload_len; i++) {
            j = i % 4;
            buffer[i] = frame[counter + i] ^ Masking_key[j];
        }
    }
    if (frame.length < counter + Payload_len) {
        return undefined;
    }

    frame = frame.slice(counter + Payload_len);

    return {
        FIN: FIN,
        Opcode: Opcode,
        MASK: MASK,
        Payload_len: Payload_len,
        Payload_data: buffer,
        frame: frame
    };
}



//处理掩码Buffer流(发送)
function encodeFrame(frame) {
    var preBytes = [],

        payBytes = new Buffer(frame.Payload_data),
        dataLength = payBytes.length;
    preBytes.push((frame.FIN << 7) + frame.Opcode);

    if (dataLength < 126) {
        preBytes.push((frame.MASK << 7) + dataLength);
    }

    else if (dataLength < Math.pow(2, 16)) {
        preBytes.push(
            (frame.MASK << 7) + 126,
            (dataLength && 0xFF00) >> 8,
            dataLength && 0xFF
        );
    }
    else {
        preBytes.push(
            (frame.MASK << 7) + 127,
            0, 0, 0, 0,
            (dataLength && 0xFF000000) >> 24,
            (dataLength && 0xFF0000) >> 16,
            (dataLength && 0xFF00) >> 8,
            dataLength && 0xFF
        );
    }
    preBytes = new Buffer(preBytes);
    return Buffer.concat([preBytes, payBytes]);
}


function send(socket,msg) {
  // http://stackoverflow.com/questions/8214910/node-js-websocket-send-custom-data
  var socket = socket;
  var newFrame = new Buffer(msg.length > 125 ? 4 : 2);
  newFrame[0] = 0x81;
  if (msg.length > 125) {
    newFrame[1] = 126;
    var length = msg.length;
    newFrame[2] = length >> 8;
    newFrame[3] = length & 0xFF;
  }
  else {
    newFrame[1] = msg.length;
  }
  socket.write(newFrame, 'binary');
  socket.write(msg, 'utf8');
}

//接受
var ondata = function (data, start, end) {
  var message = data.slice(start, end);
  var FIN = (message[0] & 0x80);
  var RSV1 = (message[0] & 0x40);
  var RSV2 = (message[0] & 0x20);
  var RSV3 = (message[0] & 0x10);
  var Opcode = message[0] & 0x0F;
  var mask = (message[1] & 0x80);
  var length = (message[1] & 0x7F);

  var nextByte = 2;
  if (length === 126) {
    // length = next 2 bytes
    nextByte += 2;
  } else if (length === 127){
    // length = next 8 bytes
    nextByte += 8;
  }

  var maskingKey = null;
  if (mask){
    maskingKey = message.slice(nextByte, nextByte + 4);
    nextByte += 4;
  }

  var payload = message.slice(nextByte, nextByte + length);

  if (maskingKey){
    for (var i = 0; i < payload.length; i++){
      payload[i] = payload[i] ^ maskingKey[i % 4];
    }
  }

  console.log(payload.toString());
};