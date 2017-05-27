/*
* pig类
*/
(function(){
  //从引擎的Sprite继承
     Pig = Sprite.extend({
     init:function(r)
     {
       //对应box2d中的物体引用
       this.b2Obj = null;
	   this._super();
	 },
     //创建box2d中的物体
	 createInB2:function()
     {
	   //定义为圆形状
       var bodyDef = new b2BodyDef();
	   bodyDef.type = b2Body.b2_dynamicBody;	   
	   //创建形状
	   var ba = new b2CircleShape(TGame.lenToB2d(this.w*0.5));
	   //创建材质
	   var fix =  new b2FixtureDef();
	   fix.shape = ba;
	   fix.density =10;
       fix.friction = 0.9;
	   fix.restitution = 0.1;
	   //创建物体
	   bodyDef.position.Set(TGame.lenToB2d(this.x),TGame.lenToB2d(this.y));
	   var pig = TGame.b2World.CreateBody(bodyDef);
	   pig.CreateFixture(fix);	   
	   //绑定box2d中物体
       this.b2Obj = pig;
       //绑定pig
       pig.SetUserData(this);
	 },
     update:function()
	 {	   		 
	   if(this.b2Obj!=null)
	    {
		   //获取物体当前位置
	       var pos = this.b2Obj.GetPosition();	
		   this.x = TGame.lenToScn(pos.x);
		   this.y = TGame.lenToScn(pos.y);
		   //获取物体角度
		   var ang = this.b2Obj.GetAngle();
		   this.deg = MathUtil.rad2deg(ang);
	    }       
	 }
   })
   //注册pig到类工厂
   Pig.ClassName = "Pig";
   ClassFactory.regClass(Pig.ClassName,Pig);
}())