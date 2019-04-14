var express = require('express')
var router = express.Router()
var Category = require('../models/Category')
var Content = require('../models/Content')
var marked = require('marked')
// 配置marked
marked.setOptions({
    renderer: new marked.Renderer(),
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
})

var data;

// 处理通用的数据 也就是我之前一直很烦的每个模板渲染都要传递userInfo: req.userInfo这个动作的处理方法
router.use(function(req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }

    Category.find().then(function(categories) {
        data.categories = categories
        next()
    })
})

router.get('/', function(req, res, next) {
    Category.find().then(function(categories) {
        var page = Number(req.query.page || 1),
            pageSize = 3,
            start = pageSize * (page - 1),
            pages = 0,
            count = 0,
            category = req.query.category || '' // 分类查询
            where = {}
        if (category) {
            where.category = category
        }
        Content.countDocuments().where(where).then(function(count) {
            pages = Math.ceil(count / pageSize)
            page = Math.min(pages, page)
            page = Math.max(1, page)
            start = pageSize * (page - 1)
            count = count
            Content.find().limit(pageSize).skip(start).populate(['category', 'user'])
                .sort({addTime: -1})
                .where(where)
                .then(function(contents) {
                    res.render('main/index.html', {
                        userInfo: req.userInfo,
                        categories: categories,
                        category: category,
                        contents: contents,
                        page: page,
                        pageSize: pageSize,
                        pages: pages,
                        count: count
                    })
                })
        })
    })
})

// 阅读全文
router.get('/view', function(req, res, next) {
    var contentId = req.query.contentid || ''

    Content.findOne({
        _id: contentId
    }).then(function (content) {
        // 阅读数统计真的简单
        content.views++
        content.save().then(function() {
            // 保存不能放在markdown格式转换之后 否则会把markdown格式转换成html格式保存回数据库
            // 单纯的放在前面也不管用，因为保存方法是异步方法
            // 把markdown格式内容转换成html格式返回
            content.content = marked(content.content)
            data.content = content
            res.render('main/view.html', data)
        })
    })
})

module.exports = router
