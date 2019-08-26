var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var data;

router.use(function(req,res,next){
    data = {
        userInfo: req.userInfo,
        categories : [],
    }
    Category.find().then(function(categories){
        data.categories = categories;
        next();
    })
})

router.get('/',function(req,res,next){
    // res.render('main/index',data);
        data.category = req.query.category || '';
        data.count = 0;
        data.page = Number(req.query.page || 1);
        data.limit = 2;
        data.pages = 0;
    var where = {};
    if(data.category){
        where.category = data.category
    }
    
    Content.where(where).countDocuments().then(function(count){
        console.log(data)
        data.count = count;
        data.pages = Math.ceil(data.count/data.limit);
        //设置取值不大于pages
        data.page = Math.min(data.page,data.pages);
        //设置取值不能小于1
        data.page = Math.max(data.page,1);
        var skip = (data.page - 1) * data.limit;

        return Content.find().where(where).sort({_id:-1}).limit(data.limit).skip(skip).populate(['categoty','user'])
    }).then(function(contents){
        data.contents = contents;
        console.log(data.contents)
        res.render('main/index',data);
    })
});

router.get('/view',function(req,res){
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function(content){
        data.content = content;

        content.views++;
        content.save();

        
        res.render('main/view',data)
        console.log(data)
    })
})
module.exports = router;