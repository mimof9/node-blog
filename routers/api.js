var express = require('express');
var router = express.Router();
var User = require('../models/User')

// 统一的返回格式
var responseData;
router.use(function(req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
})

router.get('/', function(req, res, next) {
    res.send('api请求地址');
});

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

module.exports = router;