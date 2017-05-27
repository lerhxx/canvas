//监听http服务器
var io = require("socket.io").listen(9000);
//注册连接事件
io.sockets.on("connection",function(socket){
    //注册客户端接收消息事件
	socket.on("message",function(msg){
		//处理消息
		doMsg(socket,msg);		
	})	
});
//处理客户端消息
function doMsg(socket,msg)
{  
  //获取客户端ip地址 
  var addr = socket.handshake.address.address;	
  //后台打印消息
  console.log("receive msg from "+addr+":"+msg);
  //回传消息给客户端
  socket.send("Server received messag!");
  //广播消息给其他客户端
  socket.broadcast.send(addr+" send msg:"+msg);
}