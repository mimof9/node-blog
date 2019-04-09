/*
应用程序的启动（入口）文件
 */

var express = require('express') // 加载express模块
var swig = require('swig') // swig模板引擎
var nunjucks = require('nunjucks') // nunjucks模板引擎
var mongoose = require('mongoose') // 加载数据库模块
var bodyParser = require('body-parser') // 解析url请求中的数据
var cookies = require('cookies') // 加载cookies模块
var User = require('./models/User') // 用户模型

// 创建app应用  =>  NodeJS Http.createServer()
var app = express()

// 设置静态文件托管
// 具体作用：当用户访问的url以/public开始，那么直接返回项目目录/public下的文件
app.use('/public', express.static(__dirname + '/public'))

// 配置模板引擎
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
})
// 配置bodyParser
// 调用这个方法，会自动在路由回调的req中添加上请求携带的数据body
// 要在配置路由之前调用(这个根据一个请求的处理顺序 很容易理解)
app.use(bodyParser.urlencoded({extended: true}))

// 配置cookies
app.use(function(req, res, next) {
    req.cookies = new cookies(req, res)
    // 解析登陆用户的cookie信息
    req.userInfo = {}
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'))
            // 获取用户类型，查看是否为管理员
            // 是否为管理员，不能直接存在cookie中 不安全 因此 得靠服务器通过用户id来查询
            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
                next()
            })
        } catch(e) {
            next()
        }
    } else {
        next()
    }
})

// 模块化，不在这个文件中处理实际业务
app.use('/', require('./routers/main'))
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))

/*
首页
    req request对象
    res response对象
    next 函数
 */
// app.get('/', function(req, res, next) {
//     // 不使用模板
//     // res.send('<h1>欢迎光临我的博客！</h1>')
//
//     // 使用模板 模板放在上面配置的目录中即可
//     // 第一个参数是模板文件名 第二个参数是传递给模板的数据
//     res.render('index')
// })

// 静态资源这样访问就太麻烦了
// app.get('/main.css', function(req, res, next) {
//     res.setHeader('content-type', 'text/css')
//     res.send('body {background: red;}')
// })

// 连接数据库, 在应用启动时连接一次数据库，当数据库连接成功时，才监听端口
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功')
        // 监听http请求
        app.listen(8081)
    }
}, {useNewUrlParser: true})
