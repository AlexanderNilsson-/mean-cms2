Using idea from: 
https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
For login solution, heavily modified!

//RESTRICT URLS
To restrict additional pages from being accessed, see public/js/app.js line 8

//CREATE USERS
schema: mongoose.Schema({username: String, password: String, userid: Number, role: String});
db collection: db.users
insert: db.users.insert({username:"xxx", password: "xxx", userId:1, userRole:"admin"})

Only "bug" is that views dont update upon login,so you have to refresh the browser before the logout button shows up, not very angular :/

BIG LESSON LEARNED:
when configuring /app.js routes such as:

app.get("/api/users", api.getUsers);

the string after /api/ MUST match the db collection it is going to
AKA: /api/users to access db.users, /api/posts to access db.posts

//H