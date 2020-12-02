const express = require('express');
const app = express();
const middleware = require('./middleware');
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const signoutRoute = require('./routes/logout');
const postsApiRoute = require('./routes/api/posts');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { json } = require('body-parser');
require('./database');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
    // cookie: { secure: true } // requires https connection
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(loginRoute);
app.use(registerRoute);
app.use(signoutRoute);
app.use(postsApiRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  };

  res.status(200).render('home', payload);
});

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`🎧 Listening on port ${port}`);
});
