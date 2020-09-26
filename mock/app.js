

//1.   引入对应的包
const jsonServer = require('json-server');//在node里面使用json-server包
// 4.   引入数据库
const db = require('./db.js');//引入mockjs配置模块
// const multer = reuqire('multer');
// 6.   引入操作路径的包  地址栏数据
const path = require('path');
// 7. 使用  mock随机一些 数据   定义跟路由别名
const Mock = require('mockjs');
let mock='/api';//定义路由根别名
let port = 7856;//端口

// 2.   创建服务器
const server = jsonServer.create();//创建jsonserver 服务对象


//  3.  配置jsonserver服务器 中间件  ????? 
//抓取body数据使用json-server中间件------***
server.use(jsonServer.defaults({
	// 指定的静态资源托管所在位置0
  static:path.join(__dirname, '/public'),//静态资源托管  
}));
// 使其可以接受非地址栏数据
server.use(jsonServer.bodyParser);

// let upload = multer({dest:path.join(__dirname,'public','uploads')});
// server.use(upload.any());


//. 响应

//12.  可选 统一修改请求方式   所有请求  第一步判断
server.use((req, res, next) => {
  // console.log(1)
  // request.method = 'GET';
  // 判断  登录注册页面允许通过
  if (req.url.includes('/login') || req.url.includes('/reg')){
    next()
  } else {
	  // 判断请求头携带  token  并且长度满足要求
    if (req.headers.token && req.headers.token.length===16){
		// req.headers.token && req.headers.token.length===16
      next()
    } else {
		// ------它是在下面的  统一返回数据之前发生
      setTimeout(()=>res.jsonp({
        err:2,
        msg:'token无效或过期'
      }),1000)
    }
  }

});

//13. 登录注册校验
let mr = Mock.Random;//提取mock的随机对象
// 请求方式去响应一段地址   + 别名
server.post(mock+'/login', (req, res) => {
  // console.log(req.query, req.body);//抓取提交过来的query和body
  // 抓取body数据使用json-server中间件------***
  let username=req.body.username;
  let password=req.body.password;
  (username === 'alex' && password === 'alex123')?
    res.jsonp({
      "err": 0,
      "msg": "登录成功",
      "data": {
		  // mock  里面的方法  api   数据1-5   
        "follow": mr.integer(1,5),
        "fans": mr.integer(1,5),
		// 随机名字
        "nikename": mr.cname(),
		//         生成图片  大小      颜色    文字
        "icon": mr.image('20x20',mr.color(),mr.cword(1)),
        "time": mr.integer(13,13)
      },
	  //   随机十六位 tooken   
      "token":mr.integer(16)
    }) :
    res.jsonp({
      "err": 1,
      "msg": "登录失败", 
    })

});
server.post(mock+'/reg', (req, res) => {
  let username=req.body.username;
  (username !== 'alex') ?
    res.jsonp({
      "err": 0,
      "msg": "注册成功",
      "data": {
        "follow": mr.integer(0,0),
        "fans": mr.integer(0,0),
        "nikename": mr.cname(),
        "icon": mr.image('20x20',mr.color(),mr.cword(1)),
        "time": mr.integer(13,13)
      }
    }) :
    res.jsonp({
      "err": 1,
      "msg": "注册失败",
    })

});

//8.   响应mock接口 自定义返回结构 定义mock接口别名
// (连接数据库   我们可以拿到不同的端口)
//创建路由对象 db为mock接口路由配置  db==object
const router = jsonServer.router(db);
// 11.  统一返回数据 的结构  ---------自定义了返回的数据结构
// (每一条数据返回的时候都会经过  router.render  )
router.render = (req, res) => {//自定义返回结构
   //11-1 (劫持数据)  有可能是数组  也有可能是对象
  let data = res.locals.data;//object array
  // console.log('app.js',res);
  let bl = false; 
  //11-2 前端风格访问详情的时候  返回的是一个对象    访问列表返回的是数组
  // 判断到底是数组还是对象           //  数组有  length
  if (typeof data === 'object' && Object.keys(data).length !== 0){
    bl = true;
  } else {
    bl = false; // delete 操作时，返回空对象
  }

  setTimeout(()=>{//模拟服务器延时
  // 11-3 jsonserver  里面的响应体  jsonp  -----相当于node里面express库的  res.send
    res.jsonp({
		// 返回值 
      err: bl  ? 200 : 400,
      msg: bl ? 'success' : 'error',
      data: res.locals.data
    })
  },500)

  // res.jsonp(res.locals.data)

};

// 10   定义根路由别名  用后端的方式  而非前端风格  获取数据  (postman)
server.use(jsonServer.rewriter({//路由自定义别名

  [mock+"/*"]: "/$1",

  // "/product\\?dataName=:dataName": "/:dataName",
  // "/banner\\?dataName=:dataName": "/:dataName",
  // "/detail\\?dataName=:dataName&id=:id": "/detail/:dataName/:id",

  // "/product/del\\?dataName=:dataName&id=:id": "/:dataName/:id",
  // "/product/add\\?dataName=:dataName": "/:dataName",
  // "/product/check\\?dataName=:dataName&id=:id": "/:dataName/:id"

  // "/:resource/:id/show": "/:resource/:id",
  // "/posts/:category": "/posts?category=:category",
  // "/articles\\?id=:id": "/posts/:id",
  
  
  "/api/*": "/$1",
  "/:resource/:id/show": "/:resource/:id",
  "/posts/:category": "/posts?category=:category",
  "/course_category\\?id=:id": "/course_category/:id"

}));
// 9.  将路由对象  加入响应  (用服务去安装多个路由)
server.use(router);//路由响应


//5. port  端口号设置为变量方便更改 开启jsonserver服务  启动并监听服务
server.listen(port, () => {
  console.log('mock server is running')
});