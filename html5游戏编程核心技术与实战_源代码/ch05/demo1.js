//导入http模块
var http = require("http");
//创建Web服务器
var server = http.createServer(function(req,res){
   //写响应头	 
   res.writeHead(200,{'Content-Type':'text/plain'});
   //输入文字
   res.write("Hello,Node.js!");
   //结束
   res.end();
});
//启动监听
server.listen(8888,"localhost");