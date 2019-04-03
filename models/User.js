/*
模型：用户
 */

var mongoose = require('mongoose');
var usersSchema = require('../schemas/users.js');

// 使用定义的表结构 生成模型
module.exports = mongoose.model('User', usersSchema);