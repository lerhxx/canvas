(function(){
  //aud对象
  function Aud(ctx,url)
  {
    this.ctx = ctx;
    this.url = url;
	//源节点
	this.src = ctx.createBufferSource();
	//多个处理节点组,
	this.pNode = [];
  } 
  Aud.prototype=
  {
    output:function()
	{	  
	  for(var  i=0;i<this.pNode.length;i++)
		{
	      var tNode = this.src;
		  for(var j=0;j<this.pNode[i].length;j++)
   	      {
	        tNode.connect(this.pNode[i][j]);
		    tNode = this.pNode[i][j];				          
	      }	  
		  tNode.connect(this.ctx.destination);
	    } 
	},
	play:function(loop)
	{
	  this.src.loop = loop||false;
	  this.output();
	  this.src.start(0);
	},
	stop:function()
	{
	  this.src.stop();
	},
	addNode:function(node,groupIdx)
	{
	  groupIdx=groupIdx||0;
      this.pNode[groupIdx] = this.pNode[groupIdx]||[];
	  this.pNode[groupIdx].push(node);	 
	}
  }
   //设置node类型
  Aud.NODETYPE={
    GNODE:0//表示gainNode节点
  }
  //Aud管理对象
  AudManager={   
   urls:[],
   items:[],
   ctx:null,
   init:function()
   {
      try{
	      this.ctx = new webkitAudioContext();	
      }
	  catch(e)
	  {
		  alert("不支持音频API!");
	  }
   },
   load:function(callback)
   {
     for(var i=0;i<this.urls.length;i++)
	 {
	   this.loadSingle(this.urls[i],callback);
	 }
   },
   loadSingle:function(url,callback)
   {
      var req = new XMLHttpRequest();
	  var self = this;
      req.open('GET', url, true);
	  //指定响应类型为arraybuffer
      req.responseType = 'arraybuffer';
      // 异步解码
      req.onload = function(){    	
      self.ctx.decodeAudioData(
	    this.response,
		function(buf){
		  var aud = new Aud(self.ctx,url);
		  aud.src.buffer = buf;
		  self.items.push(aud);
		  if(self.items.length==self.urls.length)
		  {
		    callback&&callback();
		  }
        },
		function(){alert("加载音频失败!");}
	   );
	 }
     req.send();
   },
   //创建节点
   createNode:function(nodeType,param)
	{
	  var node = null;
	  switch(nodeType)
	  {
		case 1:
		node = this.ctx.createPanner();
		break;
        case 2:
		node = this.ctx.createJavaScriptNode(param[0],param[1],param[2]);
		break;
        default:
        node = this.ctx.createGainNode();
	  }
	  return node;
	}
  };
}())