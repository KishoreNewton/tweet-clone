const express = require('express');
const app = express();
const middleware = require('./middleware');
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./database');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(loginRoute);
app.use(registerRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Home'
  };

  res.status(200).render('home', payload);
});

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`🎧 Listening on port ${port}`);
});
