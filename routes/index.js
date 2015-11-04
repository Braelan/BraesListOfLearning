var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
require('../models/Posts.js')
require('../models/Comments.js')
/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});

module.exports = router;

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
//PARAMS
// sets req.post with a find
router.param('post', function(req,res, next, id){
  var query = Post.findById(id);
  query.exec(function(err, post){
    if(err) { return next(err);}
    if(!post){return next(new Error('can\'t find post'));}
    req.post = post;
    return next();
  });
});

router.param('comment', function(req, res, next, id){
  var query = Comment.findById(id);
  query.exec(function(err, comment){
    if(err) {return next(err);}
    if(!comment){return next(new Error('can\'t find post'));}
    req.comment = comment
    return next();
  });
});
//POSTS ROUTERS
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

router.get('/posts/:post', function(req, res){
  req.post.populate('comments', function(err, post){
    if(err) {return next(err)}
    res.json(post);
  })
})

router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }
    res.json(post);
  });
});

router.put('/posts/:post/downvote', function(req,res, next){
  req.post.downvote(function(err, post){
    if(err) {return next(err);}
    res.json(post);
  });
});

//POSTS COMMENTS ROUTERS
router.get('/posts/:post/comments', function(req, res, next){
  Comment.find(function(err, comments) {
    if (err) {return next(err);}
    res.json(comments);
  });
});

router.post('/posts/:post/comments', function(req, res, next){
  var comment = new Comment(req.body);
  comment.post = req.post
  comment.save(function(err, comment){
    if (err) {return next(err);}
    req.post.comments.push(comment);
    req.post.save(function(err, post){
      if(err){return next(err);}
      res.json(comment);
    });
  });
});

router.put('/posts/:post/comments/:comment/upvote', function(req, res, next){
  req.comment.upvote(function(err, comment){
    if (err) { return next(err);}
    res.json(comment);
  });
});
