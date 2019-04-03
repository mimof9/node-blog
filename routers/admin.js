var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('main/index');
});

// 暴露路由，在app.js中引用，实现按需加载路由
module.exports = router;