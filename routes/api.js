var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cms');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to DB.");
});


var postSchema = mongoose.Schema({ author: String, content: String});
var Post = mongoose.model('Post', postSchema);



exports.getBlogPosts = function(req, res) {
  Post.find({}, function(err, obj) {
    console.log('bloggpost1', obj);
    res.json(obj);
  });
};

exports.getBlogPost = function(req, res) {
  Post.findOne({ _id: req.params.id }, function(err, obj) {
    res.json(obj);
  });
};

exports.createBlogPost = function(req, res) {
  var newPost = new Post (req.body);
  console.log("createBlogPost");
  newPost.save();
  res.json(req.body);
};

exports.updateBlogPost = function(req, res) {
  Post.findByIdAndUpdate(req.params.id, {
    $set: { author: req.body.author, content: req.body.content}
  }, { upsert: true },
  function(err, obj) {
    console.log("Updated blog", obj);
    return res.json(true);
  });
};

exports.deleteBlogPost = function(req, res) {
  Post.remove({ _id: req.params.id }, function(err) {
    res.json(true);
  });
};