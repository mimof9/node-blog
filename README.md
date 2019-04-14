# node-blog
使用node搭建的个人博客系统

# 版本历史
- v1.0 博客基本的业务流程已实现
- v1.1 模板引擎改用Nunjucks
- v1.2 后台使用marked提供markdown语法编辑内容

# bug：
	1. 当没有登陆时，点击阅读，comment.js会报错 不影响使用。原因是没有处理好promise的出错情况
	2. 后台分页，边界问题没有处理好 url的变化不合理
	3. 当删除一个分类的时候，这个分类下的文章分类就为空了
	4. 当分类很多的时候，一条显示就会出问题
	5. 当前业务主要用Promise写，但是在catch这块 没有很好的处理

# 修复bug：
	1. 后台使用markdown语法编写文章，数据库保存markdown格式。
	前台一旦阅读全文，数据库中markdown语法就变成html格式。
	原因：阅读全文进行了阅读量的统计，更新了数据库，把转换后的文章内容一起更新了。

# 计划
	0. 修改后台的跳转方式 改用ajax跳转 已完成
	1. 博客使用 markdown语法编辑器 添加内容 富文本就更好了 完成一半
	2. 评论区XSS攻击的解决
	3. 用fetch替换掉ajax 用querySelector替换掉$() 没有用到JQuery的其它功能

# 下一个版本
	添加富文本编辑器

# 最终期望
整理博客业务流程和相关实现细节
重构整个博客，使用react或者vue？或者仅仅换个样式框架？还没想好
需要添加的功能：
安全方面：评论区XSS
后台文章编辑：markdown或者富文本
文章搜索

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
- nunjucks：模板解析引擎
- mongoose：操作mongodb数据
- marked：marked语法解析生成模块

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

## 数据库模块mongoose
### mongoose工作的大致流程：
- 定义表结构对象
- 根据表结构对象创建模型构造函数
- 使用模型构造函数创建模型对象
- 直接操作模型对象，就是对表的操作
