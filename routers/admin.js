var express = require('express')
var router = express.Router()
var User = require('../models/User')
var Category = require('../models/Category')
var Content = require('../models/Content')

// 拦截非管理员用户进入后台
router.use(function(req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('对不起，只有管理员才可以进入该页面！')
        return
    }
    next()
})

// 后台主页
router.get('/', function(req, res, next) {
    res.render('admin/index.html', {
        userInfo: req.userInfo
    })
})

// 用户管理主页
router.get('/user', function(req, res, next) {
    /*
    分页显示所有用户的信息
    分页就借助limit和skip方法：所有分页的思路都是一样的
    基0
    每页显示2条
    那么第i页的起始位置为2 * (i-1)
     */
    var page = Number(req.query.page || 1),
        pageSize = 10,
        start = pageSize * (page - 1),
        pages = 0
    User.countDocuments().then(function(count) {
        // 计算总页数
        pages = Math.ceil(count / pageSize)
        // 规范当前页和起始位置
        page = Math.min(pages, page)
        page = Math.max(1, page)
        start = pageSize * (page - 1)

        User.find().limit(pageSize).skip(start).then(function(users) {
            res.render('admin/user_index.html', {
                userInfo: req.userInfo,
                users: users,
                page: page,
                count: count,
                pages: pages,
                pageSize: pageSize
            })
        })
    })
})

// 分类管理首页
router.get('/category', function(req, res, next) {
    var page = Number(req.query.page || 1),
        pageSize = 10,
        start = pageSize * (page - 1),
        pages = 0
    Category.countDocuments().then(function(count) {
        // 计算总页数
        pages = Math.ceil(count / pageSize)
        // 规范当前页和起始位置
        page = Math.min(pages, page)
        page = Math.max(1, page)
        start = pageSize * (page - 1)

        Category.find().sort({_id: -1}).limit(pageSize).skip(start).then(function(categories) {
            res.render('admin/category_index.html', {
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                count: count,
                pages: pages,
                pageSize: pageSize
            })
        })
    })
})

// 分类操作页
router.get('/category/add', function(req, res, next) {
    res.render('admin/category_add.html', {
        userInfo: req.userInfo
    })
})

// 文章首页
router.get('/content', function(req, res, next) {
    var page = Number(req.query.page || 1),
        pageSize = 10,
        start = pageSize * (page - 1),
        pages = 0
    Content.countDocuments().then(function(count) {
        // 计算总页数
        pages = Math.ceil(count / pageSize)
        // 规范当前页和起始位置
        page = Math.min(pages, page)
        page = Math.max(1, page)
        start = pageSize * (page - 1)

        Content.find().sort({_id: -1}).limit(pageSize).skip(start).populate(['category', 'user'])
            .then(function(contents) {
                res.render('admin/content_index.html', {
                    userInfo: req.userInfo,
                    contents: contents,
                    page: page,
                    count: count,
                    pages: pages,
                    pageSize: pageSize
                })
            })
    })
})

// 添加文章
router.get('/content/add', function(req, res, next) {
    Category.find().sort({_id: -1}).then(function(categories) {
        res.render('admin/content_add.html', {
            userInfo: req.userInfo,
            categories: categories
        })
    })
})


// 添加文章提交
router.post('/content/add', function(req, res, next) {
    if (!req.body.category) {
        res.render('admin/error.html', {
            userInfo: req.userInfo,
            message: '分类不能为空'
        })
        return
    }
    if (!req.body.title) {
        res.render('admin/error.html', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        })
        return
    }
    new Content({
        category: req.body.category,
        user: req.userInfo._id.toString(),
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).save().then(function() {
        res.render('admin/success.html', {
            userInfo: req.userInfo,
            message: '文章添加成功',
            url: '/admin/content'
        })
    })
})

// 编辑文章
router.get('/content/edit', function(req, res, next) {
    var id = req.query.id || ''
    Category.find().sort({_id: -1}).then(function(categories) {
        Content.findOne({
            _id: id
        }).then(function(content) {
            if (!content) {
                res.render('admin/error.html', {
                    userInfo: req.userInfo,
                    message: '文章不存在'
                })
                return Promise.reject()
            } else {
                res.render('admin/content_edit.html', {
                    userInfo: req.userInfo,
                    categories: categories,
                    content: content
                })
            }
        })
    })
})

// 编辑文章提交
router.post('/content/edit', function(req, res, next) {
    var id = req.query.id || ''
    if (!req.body.category) {
        res.render('admin/error.html', {
            userInfo: req.userInfo,
            message: '分类不能为空'
        })
        return
    }
    if (!req.body.title) {
        res.render('admin/error.html', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        })
        return
    }
    Content.updateOne({
        _id: id
    }, {
        category: req.body.category,
        user: req.userInfo._id.toString(),
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function() {
        res.render('admin/success.html', {
            userInfo: req.userInfo,
            message: '文章修改成功',
            url: '/admin/content'
        })
    })
})

// 文章删除
router.get('/content/delete', function(req, res, next) {
    var id = req.query.id
    Content.deleteOne({
        _id: id
    }).then(function() {
        res.render('admin/success.html', {
            userInfo: req.userInfo,
            message: '文章删除成功',
            url: '/admin/content'
        })
    })
})

// 暴露路由，在app.js中引用，实现按需加载路由
module.exports = router;
