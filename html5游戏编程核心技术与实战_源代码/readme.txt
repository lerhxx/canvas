所有的演示案例都在chrome25.0版本下演示通过。
需要注意的地方:
涉及到读取本地json文件的代码会受到chrome浏览器阻止，比如在第4章游戏引擎部分，9~11章的综合案例等，解决方法有两种：
1：把html代码部署在任意一种web服务器上,比如apache、tomcat、iis等，通过http协议访问。
2：如果需要直接通过本地访问，则需要通过快捷方式启动chrome,打开chrome快捷方式的属性，在加上--allow-file-access-from-files参数进行启动。

