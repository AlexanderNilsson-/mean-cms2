var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cms');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to DB.");
});


var postSchema = mongoose.Schema({ author: String, title: String, content: String, timeStamp: Number});
var Post = mongoose.model('Post', postSchema);

var userSchema = mongoose.Schema({username: String, password: String, role: String});
var User = mongoose.model('User', userSchema);

//get user data
exports.getUsers = function (req, res) {
  User.find({}, function(err, obj) {
    console.log("find all users", obj);
    res.json(obj);
  });
};
exports.getUser = function(req, res) {
  // User.find({user_name: req.params.user_name, password: req.params.password}, function(err, obj) {
  User.findOne({username: req.params.username, password: req.params.password}, function(err, obj) {
    console.log("Login Response: ", obj);
    res.json(obj);
  });
};

exports.createUser = function(req, res) {
  var newUser = new User (req.body);
  console.log("createUser");
  newUser.save();
  res.json(req.body);
};

exports.getBlogPosts = function(req, res) {
  Post.find({}, function(err, obj) {
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
  console.log("createBlogPost", req.body);
  newPost.save();
  res.json(req.body);
};

exports.updateBlogPost = function(req, res) {
  Post.findByIdAndUpdate(req.params.id, {
    $set: { author: req.body.author,title: req.body.title, content: req.body.content}
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