/*
应用程序的启动（入口）文件
 */

// 加载express模块
var express = require('express');
// 加载模板处理模块
var swig = require('swig');

// 创建app应用  =>  NodeJS Http.createServer();
var app = express();

// 配置应用模板
// 定义当前应用所使用的模板引擎
// 第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
// 设置模板文件存放的目录
app.set('views', './views');
// 注册所使用的模板引擎，第一个参数是'view engine'，第二个参数就是前面定义的模板引擎的第一个参数
app.set('view engine', 'html');
// 在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

/*
首页
    req request对象
    res response对象
    next 函数
 */
app.get('/', function(req, res, next) {
    // 不使用模板
    // res.send('<h1>欢迎光临我的博客！</h1>');

    // 使用模板 模板放在上面配置的目录中即可
    // 第一个参数是模板文件名 第二个参数是传递给模板的数据
    res.render('index')
})

// 监听http请求
app.listen(8081);