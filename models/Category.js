var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories.js');

// 使用定义的表结构 生成模型
module.exports = mongoose.model('Category', categoriesSchema);