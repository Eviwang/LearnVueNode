let handler = {};
handler.index = {};

handler.index.index = function(req,res){
    res.write("index");
    res.end();
}





module.exports = handler;