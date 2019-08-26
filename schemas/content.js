var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    //内容分类ID
    category: {
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Content'
    },
    title : String,
    //用户ID
    user: {
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },

    addTime: {
        type: Date,
        dafault: new Date()
    },

    //点击数
    views: {
        type: Number,
        default: 0
    },
    //简介

    description: {
        type: String,
        default: ''
    },
    //内容
    content: {
        type: String,
        default: ''
    },
    //评论
    comments: {
        type: Array,
        default: []
    }
});