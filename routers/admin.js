var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');


router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send('sorry,yu are not admin');
        return;
    }
    next();
})

router.get('/',function(req,res,next){
    res.render('admin/index.html',{
        userInfo: req.userInfo
    });
})

/*
*用户管理
*
*linit(Number) : 限制获取数据
*
*skip() : 忽略条数
*
*/
router.get('/user',function(req,res){

    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    User.countDocuments().then(function(count){

        pages = Math.ceil(count/limit);
        //设置取值不大于pages
        page = Math.min(page,pages);
        //设置取值不能小于1
        page = Math.max(page,1);
        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function(users){

            res.render('admin/user_index.html',{
                userInfo: req.userInfo,
                users: users,
                count,
                pages,
                limit,
                page: page
            });
        });
    })

    
});

/*
*博客分类
*/
router.get('/category',function(req,res){
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    Category.countDocuments().then(function(count){

        pages = Math.ceil(count/limit);
        //设置取值不大于pages
        page = Math.min(page,pages);
        //设置取值不能小于1
        page = Math.max(page,1);
        var skip = (page - 1) * limit;


        /*
        *sort排序
        *1:升序
        *-1:降序
        */
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){

            res.render('admin/category_index.html',{
                userInfo: req.userInfo,
                categories: categories,
                count,
                pages,
                limit,
                page: page
            });
        });
    })
});

/*
*分类增加
*/
router.get('/category/add',function(req,res){
    res.render('admin/category_add',{
        userInfo: req.userInfo
    })
})

/*
*分类保存
*/
router.post('/category/add',function(req,res){
    var name = req.body.name || "";
    if(name == ""){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: "名称不能为空"
        });
    }
        Category.findOne({
            name: name
        }).then(function(rs){
            if(rs){
                res.render('admin/error',{
                    userInfo: req.userInfo,
                    message: '该分类已经存在'
                })
                return Promise.reject();
            }else{
                return new Category({
                    name: name
                }).save();
            }
        }).then(function(newCategory){
            res.render('admin/success',{
                userInfo: req.userInfo,
                message: '分类保存成功',
                url: '/admin/category'
            })
        });
    
})
/*
*分类修改
*/
router.get('/category/edit',function(req,res){

    var id = req.query.id || '';
    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/category_edit',{
                userInfo: req.userInfo,
                category: category
            })
        }
    }).catch(new Function());

})

/*
*分类修改保存
*/
router.post('/category/edit',function(req,res){
    var id = req.query.id || '';
    var name = req.body.name || '';

    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类不存在'
            });
            return Promise.reject();
        }else{
            if(name == category.name){
                res.render('admin/success',{
                    userInfo: req.userInfo,
                    message: '分类名修改成功',
                    url: '/admin/category'
                })
                return Promise.reject();
            }else{
                return Category.findOne({
                    _id: {$ne:id},
                    name: name
                })
            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '已有分类'
            })
            return Promise.reject();
        }else {
            return Category.update({
                _id: id
            },{
                name: name
            });
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        })
    }).catch(new Function());
})

/*
*分类删除
*/

router.get('/category/delete',function(req,res){
    var id = req.query.id;
    Category.deleteOne({
        _id: id
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        })
    }).catch(new Function())
})


/*
*内容首页
*/

router.get('/content',function(req,res){
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    Content.countDocuments().then(function(count){

        pages = Math.ceil(count/limit);
        //设置取值不大于pages
        page = Math.min(page,pages);
        //设置取值不能小于1
        page = Math.max(page,1);
        var skip = (page - 1) * limit;


        /*
        *sort排序
        *1:升序
        *-1:降序
        */
        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['categoty','user']).then(function(contents){

            res.render('admin/content_index.html',{
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
    })

/*
*内容添加
*/

router.get('/content/add',function(req,res){

    Category.find().sort({_id: -1}).then(function(categories){
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories: categories
        })
    })
    
})

/*
*内容保存
*/
router.post('/content/add',function(req,res){
    // console.log(req.body)
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    //内容保存
    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function(rs){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    }).catch(new Function())
})

/*
*内容修改
*/

router.get('/content/edit',function(req,res){
    var id = req.query.id ||'';
    var categories = [];
    Category.find().sort({_id: -1}).then(function(rs){

        categories = rs;

        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function(content){
        if(!content){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '内容不存在'
            });
            return Promise.reject();
        }else {
            res.render('admin/content_edit',{
                userInfo: req.userInfo,
                categories: categories,
                content: content
            })
        }
    })

    
})

/** 
 * 保存修改内容
 * */

 router.post('/content/edit',function(req,res){
    var id = req.query.id ||'';

    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    Content.update({
        _id: id
    },{
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function() {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '修改保存成功',
            url: '/admin/content'
        })
    })
 });


 /*
 *内容删除
 */
router.get('/content/delete',function(req,res){
    var id = req.query.id || '';
    Content.deleteOne({
        _id: id
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        })
    }).catch(new Function())
})

module.exports = router;


