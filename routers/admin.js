var express = require('express')
var router = express.Router()
var User = require('../models/User')
var Category = require('../models/Category')

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
    res.render('admin/index', {
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
            res.render('admin/user_index', {
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

        Category.find().limit(pageSize).skip(start).then(function(categories) {
            res.render('admin/category_index', {
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
    res.render('admin/category_add', {
        userInfo: req.userInfo
    })
})

// 添加分类
router.post('/category/add', function(req, res, next) {
    var name = req.body.name || ''
    if (name === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        })
        return;
    }

    Category.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在了'
            })
            return Promise.reject()
        } else {
            return new Category({
                name: name
            }).save()
        }
    }).then(function(newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        })
    })
})

// 编辑分类
router.get('/category/edit', function(req, res, next) {
    var id = req.body.id || ''
    Category.findOne({
        id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            })
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            })
        }
    })
})

// 删除分类

// 暴露路由，在app.js中引用，实现按需加载路由
module.exports = router;