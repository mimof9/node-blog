var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('api请求地址');
});

module.exports = router;