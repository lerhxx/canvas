(function(){
   var http = require("http"),
	   fs = require("fs"),
	   url = require("url");   
   //定义HttpServer对象
   var HttpServer = function(port)
	  {    	   
	   //由http模块创建的server对象
	   this.server = http.createServer(doRequest);
	   //服务器绑定的端口号
	   this.port = port;	   	  
	   //加载静态资源
	   function loadStaticResource(request,response)
       {           	
		   //通过url解析请求中的url对象
		   var pURL = url.parse(request.url);
		   var fName = __dirname+pURL.pathname;  
           fs.exists(fName,function(exists){
		      if(exists)
			   {
                  fs.readFile(fName,function(err,data){
					  if(err)
					  {
						 throw err;
					  }
					  else
                      {						 
						  //设置mime内容类型
						  var contentType = "text/html";
						  response.writeHead(200,{"Content-type":contentType});
						  response.write(data);
						  response.end();
					  }  
				  });
			   }
			  else
			   {
                 response.end("404 not found!");
			   }
		   })	
	   }
       //响应静态请求
	   function doRequest(request,response){				  
	       loadStaticResource(request,response);
	   };	  
   }
   //设定HttpServer对象的start方法
   HttpServer.prototype.start=function()
	{		  
	  this.server.listen(this.port);
	  console.log("listen:"+this.port);	  
    }
   //创建HttpServer
   var server = new HttpServer(9001);  
   //启动server
   server.start();
   console.log(__dirname);
}())