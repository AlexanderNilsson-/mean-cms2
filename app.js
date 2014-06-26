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