/* 
应用程序入口
*/

var express = require('express');
//加载模板处理模块
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser,处理post请求数据
var bodyParser = require('body-parser');
//加载cookies
var Cookies = require('cookies');
var app = express();

var User = require('./models/User')

// 静态文件托管
//第一个参数为目录
//第二个参数为处理方式.当访问的目录为/public时，从这个目录下取出文件
app.use('/public',express.static(__dirname + '/public'));

//配置应用模板
//定义当前应用使用的模板引擎
//第一个参数：模板类型
//第二个参数解析模板的方法
app.engine('html',swig.renderFile);
//设置模板目录：第一个参数必须是view，第二个为目录
app.set('views','./views');
//注册使用的模板引擎，第一个参数不变；第二个参数和app.engine一致
app.set('view engine','html');

//开发过程中，可以取消模板缓存
swig.setDefaults({cache:false});

//bodyparder设置
app.use(bodyParser.json());
app.use( bodyParser.urlencoded({extended: false}) );

app.use( function(req,res,next){
    req.cookies = new Cookies(req,res);
    // next();
    //解析cookies
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
    //     // console.log(1)
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            //获取当前登录用户的权限是否为管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });
        }catch(e){
            next();
        }
    }
    else{
        next();
    }
    
})

/*
*根据不同功能划分模块
*/
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:27018/blog',{ useNewUrlParser: true },function(err){
    if(err){
        console.log('数据库连接失败')
    }else{
        console.log('数据库连接成功');
        app.listen(8081);
    }
});

