var mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    // 关联字段：分类信息
    category: {
        type: mongoose.Schema.Types.ObjectId,
        // 引用的模型
        ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // 添加时间
    addTime: {
        type: Date,
        default: new Date()
    },
    // 阅读量
    views: {
        type: Number,
        default: 0
    },
    // 评论
    comments: {
        type: Array,
        default: []
    },
    title: String,
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    }
})
