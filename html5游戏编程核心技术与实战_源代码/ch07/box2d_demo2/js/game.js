(function(win){
	var _Game = Game.extend({	
		//box2d世界
		b2World:null,
        //box2d比例
	    b2Scale:30,
        frames:60,
		init:function()
		{
		  this._super();
	      var scm = this.sceneManager; 
	      //创建场景
          var x = (document.body.clientWidth-1024)*0.5;
	      var sc = scm.createScene([{"x":x,"w":1024,"h":600,"name":"main"}]);
		  //设置场景背景
          sc.setBGImg("imgs/bg.png",1);
		  //初始化box2d
		  this.initBox2d();
		  //初始化监听器
          this.initListener();
		  this.loadRes(sc);
		},
		//初始box2d
		initBox2d:function()
	    {
          b2Vec2 = Box2D.Common.Math.b2Vec2;
          b2AABB = Box2D.Collision.b2AABB;
          b2BodyDef = Box2D.Dynamics.b2BodyDef;
          b2Body = Box2D.Dynamics.b2Body;
          b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
          b2Fixture = Box2D.Dynamics.b2Fixture;
          b2World = Box2D.Dynamics.b2World;
          b2MassData = Box2D.Collision.Shapes.b2MassData;
          b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
          b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
          b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
          b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;
		  //初始box2d世界
		  this.b2World = new b2World(new b2Vec2(0,60),true);
          this.initDebugDraw();
	    },	
        //初始化box2dDebugDraw 
	    initDebugDraw:function()//绘制
		 {
          var sc = this.sceneManager.getScene("main");	
          var debugDraw = new b2DebugDraw();
	 	  debugDraw.SetSprite(sc.ctx);
		  debugDraw.SetDrawScale(this.b2Scale);
	      debugDraw.SetFillAlpha(0);
		  debugDraw.SetAlpha(0);
		  debugDraw.SetLineThickness(1.0);
		  debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	      this.b2World.SetDebugDraw(debugDraw);
   	    },
		//加载资源
	    loadRes:function(scene)
	    {
		  var self = this;
		  ResManager.loadRes("data/res.json",function(){
			self.initSprite();
			self.run(self.frames); 
		  });      
	    },    
	   //转换长度到box2d世界
	   lenToB2d:function(pixel)
	   {
          return pixel/this.b2Scale;
	   },
       //转换box2d长度到屏幕像素
       lenToScn:function(b2Len)
	   {
          return this.b2Scale*b2Len;
	   },
		//创建精灵  	
	   initSprite:function()
	   {		 
		  this.initFloor();
	   },
       //创建小猪
	   createPig:function(x,y)
	   {
          var sc = this.sceneManager.getScene("main");	
		  var pig = sc.createRObj(Pig.ClassName);
		  pig.setAnims(ResManager.getAnimationsByName("sprite","pig"));
		  pig.setAnimSpeed(0.1);
		  pig.moveTo(x,y);
          pig.createInB2();		  		  
	   },
	   //创建地板,地板不需要绘制
	   initFloor:function()
	   {
           //定义floor类型
	      var bodyDef = new b2BodyDef();
	      bodyDef.type = b2Body.b2_staticBody;
	      bodyDef.position.Set(this.lenToB2d(512),this.lenToB2d(530));
	      //创建形状
          var box = new b2PolygonShape();
          box.SetAsBox(this.lenToB2d(512),this.lenToB2d(10));           
	      //创建floor;
	      var floor = this.b2World.CreateBody(bodyDef);  
	      //创建材质
	      floor.CreateFixture2(box);
	   },
	   //增加游戏监听器
	   initListener:function()
	   {
		 var self = this;
         //增加监听器
         var ltn = new AppEventListener({
	      "beforeRender":function(){	
			   self.b2World.Step(1/self.frames, 8, 1);
               self.b2World.DrawDebugData();
	      }
 	     });
	     this.addListener(ltn);
	   }
	})
   //定义全局TGame
   win.TGame = new _Game();  
    //定义鼠标事件 
   Mouse.sDLG("down",function(e){
	   //获取游戏窗口坐标
	   var sc = TGame.sceneManager.getScene("main");
	   var gx = sc.x,
           gy = sc.y,
		   mx = Mouse.gX(),
		   my = Mouse.gY();
	   //转换鼠标坐标到游戏窗口坐标系
	   var cd = MathUtil.mapSToCoord(mx,my,gx,gy);
       var pig = TGame.createPig(cd[0],cd[1]); 
   });
}(window))