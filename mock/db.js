

// 用mockjs模拟生成数据
var Mock = require('mockjs');

// node app.js 要求db.js 暴露一个object

//   mapData  2   是两个工具函数
let mapData = (n) => {
  let data=[];

  for (let i=1; i<=n; i++){
    data.push({
		// id  首先是  对象型的字符串  mongidb  数据库给的是_id
      _id: i+'',
	  // /:varname/:id   ------不认_id
      id: i+'',
	  // 标题
      title:'@ctitle(8,12)',
	  // 描述
      des:'@ctitle(10,20)',
	  // 时间戳
      time:'@integer(1594004307038,1598004307038)',
	  // 
      detail:{
		  // 随机的图片
        auth_icon:Mock.Random.image('50x50',Mock.Random.color(),Mock.Random.cword(1)),
		// 
        auth:'@cname()',
		
		// 后台管理系统的时候    副文本输入框  实际发送到数据库的是这种字段
		// vue-html   添加数据    [ 纯中文的字段 ]
		//      3    段每段10-15行  最终转化为字符串  放到里面去
          content: [1,2,3].map(()=>(
		//                              首行缩进2em      中文    段落
          "<p style='margin-top: 20px;text-indent: 2em'>"+"@cparagraph(10,15)"+"</p>"
        )).join('')
      }
    })
  }

  return data;
};

let mapData2 = (n) => {
  let data=[];

  for (let i=1; i<=n; i++){
    data.push({
      _id: i+'',
      id: i+'',
      title:'@ctitle(4,8)',
      sub_title:'@ctitle(6,12)',
      banner: Mock.Random.image('1680x745',Mock.Random.color(),Mock.Random.cword(4,8)),
      time:'@integer(1594004307038,1598004307038)',
      detail:{
        auth_icon:Mock.Random.image('50x50',Mock.Random.color(),Mock.Random.cword(1)),
        auth:'@cname()',
        content:[1,2,3].map(()=>(
		//                              首行缩进2em      中文    段落
          "<p style='margin-top: 20px;text-indent: 2em'>"+"@cparagraph(10,15)"+"</p>"
        )).join('')
      }
    })
  }

  return data;
};

// 要求对外暴露一个对象
module.exports = Mock.mock({
  // 用户数据的返回  一次一个
  'user': {
    "follow":Mock.Random.integer(0,100),
    "fans":Mock.Random.integer(0,100),
    "nikename":Mock.Random.cname(),
    "icon":Mock.Random.image('20x20',Mock.Random.color(),Mock.Random.cword(1)),
    "time":Mock.Random.integer(13)
  },
  'banner':mapData2(10),
  'home': mapData(100),
  'follow': mapData(80),
  'column': mapData(60),
  
});

/* module.exports = () => {
  
  // 使用 Mock
    var data = Mock.mock({
      'course|30': [
        {
          // 属性 id 是一个自增数，起始值为 1，每次增 1
          'id|+1': 1000,
          course_name: '@ctitle(5,10)',
          autor: '@cname',
          college: '@ctitle(6)',
          'category_Id|1-6': 1
        }
      ],
      'course_category|6': [
        {
			// 有瑕疵   如果是30张图片  会把图片地址做好一份复制30份
          "id|+1": 1,
          "pid": -1,
          cName: '@ctitle(4)'
        }
      ]
    });
  
  // 返回的data会作为json-server的数据
  return data;
    
}; */




// 概念  :  富文本编辑器 ,  dom模拟的  插件



















// // 用mockjs模拟生成数据
// var Mock = require('mockjs');
// // 将函数暴露出去  且有返回值
// module.exports = () => { 
  
//   // 使用 Mock对象上的   mock方法  对象的形式
//       // 返回的是数据本身
//     var data = Mock.mock({
// 	 // 接口   生成多少条数据
//       'course|30': [
//         {
//           // 属性 id 是一个自增数，起始值为 1，每次增 1
//           'id|+1': 1000,
// 		  // 名称    @ c--中文  title 标题  5-10 位
//           course_name: '@ctitle(5,10)',
// 		  // 作者   中文   名字
//           autor: '@cname',
// 		  // 6 条内容
//           college: '@ctitle(6)',
// 		  // id   随机1-6
//           'category_Id|1-6': 1,
		  
// 		  // --------查文档-------
//         }
//       ],
//       'course_category|60': [
//         {
//           "id|+1": 1,
//           "pid": -1,
//           cName: '@ctitle(4)'
//         }
//       ]
//     });
  
//   // 返回的data会作为json-server的数据
//   return data;
    
// }; 