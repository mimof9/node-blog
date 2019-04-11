var express = require('express')
var router = express.Router()
var User = require('../models/User')
var Content = require('../models/Content')
var Category = require('../models/Category')

// 统一的返回格式
var responseData;
router.use(function(req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next()
})

router.get('/', function(req, res, next) {
    res.send('api请求地址')
})

/*
用户注册
    注册逻辑：
    1. 用户名不能为空
    2. 密码不能为为空
    3. 两次输入密码必须一致
    4. 用户是否已存在 数据库查询
 */
router.post('/user/register', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    console.log(req)
    console.log(req.body, username, password, repassword)
    if (username === '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData); // 把对象封装成json数据返回给前端
        return;
    }
    if (password === '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if (password !== repassword) {
        responseData.code = 3;
        responseData.message = '密码不一致';
        res.json(responseData);
        return;
    }
    // 数据库查询用户是否存在
    User.findOne({
        username: username
    }).then(function(userInfo) {
        if (userInfo) {
            responseData.code = 4;
            responseData.message = '用户名已存在';
            res.json(responseData);
            return;
        }
        // 保存注册信息到数据库
        var user = new User({
            username: username,
            password: password
        })
        user.save().then(function(newUserInfo) {
            responseData.message = '注册成功';
            res.json(responseData);
        })
    })
})

// 用户登陆
router.post('/user/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if (username === '' || password === '') {
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }

    // 查询数据库
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.message = '登陆成功'
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        // 返回cookies
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }))
        res.json(responseData)
    })
})

// 用户退出
router.get('/user/logout', function(req, res, next) {
    req.cookies.set('userInfo', null)
    res.json(responseData)
})

// 提交评论
router.post('/comment/post', function(req, res, next) {
    var contentId = req.body.contentid || ''
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    }
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        content.comments.push(postData)
        return content.save()
    }).then(function(newContent) {
        responseData.message = '评论成功'
        responseData.data = newContent
        res.json(responseData)
    })
})

// 获取所有评论
router.get('/comment', function(req, res) {
    var contentId = req.query.contentid || ''
    console.log(req.query)
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        responseData.data = content.comments
        res.json(responseData)
    }).catch(function(err) {
        console.log(err)
    })
})

// 添加分类
router.post('/category/add', function(req, res, next) {
    var name = req.body.name || ''
    if (name === '') {
        responseData.code = 1
        responseData.message = '名称不能为空'
        res.json(responseData)
        return;
    }

    Category.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {
            responseData.code = 2
            responseData.message = '分类已存在'
            res.json(responseData)
            return Promise.reject()
        } else {
            return new Category({
                name: name
            }).save()
        }
    }).then(function(newCategory) {
        responseData.message = '分类保存成功'
        responseData.data = newCategory
        res.json(responseData)
    })
})

// 删除分类
router.get('/category/delete', function(req, res, next) {
    var id = req.query.id

    Category.deleteOne({
        _id: id
    }).then(function() {
        responseData.code = 0
        responseData.message = '删除成功'
        res.json(responseData)
    })
})

// 修改分类
router.post('/category/edit', function(req, res, next) {
    var id = req.query.id || ''
    var name = req.body.name || ''
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            responseData.code = 1
            responseData.message = '分类不存在'
            res.json(responseData)
            return Promise.reject()
        } else {
            if (name === category.name) {
                responseData.code = 2
                responseData.message = '没有做任何更改'
                res.json(responseData)
                return Promise.reject()
            } else {
                // 查询数据库中是否已经存在相同名称
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                })
            }
        }
    }).then(function(sameCategory) {
        if (sameCategory) {
            responseData.code = 3
            responseData.message = '该分类名称已存在'
            res.json(responseData)
            return Promise.reject()
        } else {
            return Category.updateOne({
                _id: id
            }, {
                name: name
            })
        }
    }).then(function() {
        responseData.message = '修改成功'
        res.json(responseData)
    })
})

module.exports = router
