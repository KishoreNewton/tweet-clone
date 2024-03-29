const express = require('express');
const app = express();
const router = express.Router();
const User = require('../schemas/User');
const bcrypt = require('bcrypt');

app.set('view engine', 'pug');
app.set('views', 'views');

router.get('/register', (req, res, next) => {
  res.status(200).render('register');
});

router.post('/register', async (req, res, next) => {
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password;

  const payload = req.body;

  if (firstName && lastName && username && email && password) {
    const user = await User.findOne({
      $or: [{ username }, { email }]
    }).catch(error => {
      console.log(error);
      payload.errorMessage = 'Something Went Wrong';
      res.status(200).render('register', payload);
    });

    if (user) {
      if (email === user.email) {
        payload.errorMessage = 'E-Mail already in use';
      } else {
        payload.errorMessage = 'Username already in use';
      }
      return res.status(200).render('register', payload);
    }

    const data = req.body;
    data.password = await bcrypt.hash(password, 10);

    User.create(data)
      .then(user => {
        req.session.user = user;
        return res.redirect('/');
      })
      .catch(err => {
        payload.errorMessage = 'Something Went Wrong';
        return res.statue(200).render('register', payload);
      });
  } else {
    payload.errorMessage = 'Make sure each field is a valid value';
    res.status(422).render('register', payload);
  }
});

module.exports = router;
