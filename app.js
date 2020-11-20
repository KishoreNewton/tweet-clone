const express = require('express');
const app = express();
const middleware = require('./middleware');
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectToDb = async () => {
  await mongoose
    .connect('mongodb://localhost/twitterclone', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(() => {
      console.log('🚀 Connected to database successfully');
    })
    .catch(err => {
      console.log('📶 Db connection failed', err);
    });
};
connectToDb();

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
