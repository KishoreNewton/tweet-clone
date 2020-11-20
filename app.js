const express = require('express');
const app = express();
const middleware = require('./middleware');
const loginRoute = require('./routes/loginRoutes');
const path = require('path');

const port = 3000;
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(loginRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Home'
  };

  res.status(200).render('home', payload);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
