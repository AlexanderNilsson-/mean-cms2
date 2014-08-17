To reach admin-page go to /admin


Using idea from: 
https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
For login solution, heavily modified!


BIG LESSON LEARNED:
when configuring /app.js routes such as:

app.get("/api/users", api.getUsers);

the string after /api/ MUST match the db collection it is going to
AKA: /api/users to access db.users, /api/posts to access db.posts

//H