# node-blog
使用node搭建的个人博客系统

## 功能
### 前台
- 首页内容聚合
- 列表页—— 分类列表
- 内容页—— 评论
- 注册
- 登录
### 后台
- 登陆
- 分类管理
	- 分类列表
	- 添加分类
	- 修改分类
	- 删除分类
	- 查看分类下所有博文
- 内容管理
	- 内容列表
		- 所有内容
		- 按分类查看
	- 添加内容
	- 修改内容
	- 删除内容
	- 查看内容下的所有评论
- 评论管理
	- 评论列表
		- 所有评论
		- 查看指定博文的评论
	- 删除评论

## 技术选型
### NodeJS：核心开发语言
### Express：web应用框架
### Mongodb
### 第三方模块&中间件
- bodyParser：解析post请求数据
- cookies：读/写cookie
- swig：模板解析引擎
- mongoose：操作mongodb数据
- markdown：markdown语法解析生成模块

## web开发的大体思路
- 浏览器发送http请求
- 服务器接收到url
- 从url中解析路由
- 根据路由解析结果找到处理本次请求的函数
- 执行指定的绑定函数，返回对应内容给用户

### 静态资源
- url以/public开头
- 直接读取指定目录下的文件，返回给用户
### 动态路由
- 处理业务逻辑，加载模板，解析模板
- 返回数据给用户

## 模块化
### 按照功能划分
- 前台模块
- 后台模块
- api模块
### 具体使用Express的app.use()方法实现模块化
```
app.use('/', require('./router/main'));
app.use('/admin', require('./router/admin'));
app.use('/api', require('./router/api'))
```