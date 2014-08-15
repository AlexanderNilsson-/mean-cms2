var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api');

var app = module.exports = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get("/api/tags", api.getTags);
app.post("/api/tags", api.createTag);
app.get("/api/tags/:id", api.getTag);
app.put("/api/tags/:id", api.updateTag);
app.delete("/api/tags/:id", api.deleteTag);

//get user details for login
app.get("/api/users", api.getUsers);
app.post('/api/users', api.createUser);
app.get("/api/users/:id", api.getUser);
app.put('/api/users/:id', api.updateUser);
app.delete('/api/users/:id', api.deleteUser);

app.get('/api/posts', api.getBlogPosts);
app.get('/api/posts/:id', api.getBlogPost);

app.post('/api/posts', api.createBlogPost);
app.put('/api/posts/:id', api.updateBlogPost);

app.delete('/api/posts/:id', api.deleteBlogPost);

app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
});


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
