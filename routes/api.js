var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cms');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to DB.");
});


var postSchema = mongoose.Schema({
  author: String,
  title: String,
  content: String,
  timeStamp: Number,
  tags:[{type:mongoose.Schema.Types.ObjectId, ref: 'Tag'}]
});
var Post = mongoose.model('Post', postSchema);

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  role: String
});
var User = mongoose.model('User', userSchema);

var tagSchema = mongoose.Schema({
  tag: {
    type: String,
    unique: true
  }
});
var Tag = mongoose.model("Tag", tagSchema);

exports.getTags = function(req, res) {
  Tag.find({}, function(err, obj) {
    console.log("Found tags: ", obj);
    res.json(obj);
  });
};

exports.getTag = function(req, res) {
  Tag.findOne({ _id: req.params.id }, function(err, obj) {
    console.log("Found tag: ", obj);
    res.json(obj);
  });
};

exports.createTag = function(req, res) {
  var newTag = new Tag (req.body);
  // Check if tag already exists, and if it does, use it. Otherwise save as new.
  Tag.findOne({ tag: req.body.tag }, function(err, obj) {
    // If it doesnt exist
    if (obj === null) {
      console.log("no match in current DB, saving as new post: ", newTag);
      newTag.save();
      res.json(newTag);
    }
    // If it exists
    else {
      console.log("already exists in DB: ", obj);
      res.json(obj);
    }
  });
};

exports.updateTag = function(req, res) {
  Tag.findByIdAndUpdate(req.params.id, {
    $set: { tag: req.body.name }
  }, { upsert: true },
  function(err, obj) {
    console.log("Updated tag", obj);
    return res.json(true);
  });
};

exports.deleteTag = function(req, res) {
  Tag.remove({ _id: req.params.id }, function(err) {
    res.json(true);
  });
};

//get user data
exports.getUsers = function (req, res) {
  User.find(function(err, obj) {
    //always check that an admin user exists
    var adminExists = false;
    for(var i = 0; i < obj.length; i++) {
      if (obj[i]["role"] == "admin") {
        adminExists = true;
      }
    }
    obj.push({"adminExists": adminExists});

    res.json(obj);
  });
};

exports.getUser = function(req, res) {
  User.findOne({_id: req.params.id}, function(err, obj) {
    console.log("getUser: ", obj);
    res.json(obj);
  });
};

exports.createUser = function(req, res) {
  var newUser = new User (req.body);
  console.log("createUser");
  newUser.save();
  res.json(req.body);
};

exports.updateUser = function(req, res) {
  User.findByIdAndUpdate(req.params.id, {
    $set: { username: req.body.username,password: req.body.password, role: req.body.role}
  }, { upsert: true },
  function(err, obj) {
    console.log("Updated user", obj);
    return res.json(true);
  });
};

exports.deleteUser = function(req, res) {
  User.remove({ _id: req.params.id }, function(err) {
    res.json(true);
  });
};

exports.getBlogPosts = function(req, res) {
  Post.find({}).populate("tags").exec(function(err, obj) {
    res.json(obj);
  });
};

exports.getBlogPost = function(req, res) {
  Post.findOne({ _id: req.params.id }).populate("tags").exec(function(err, obj) {
    obj.timeCreated = new Date(obj.timeStamp);
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