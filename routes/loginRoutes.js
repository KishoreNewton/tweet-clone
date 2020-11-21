const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../schemas/User');

app.set('view engine', 'pug');
app.set('views', 'views');

router.get('/login', (req, res, next) => {
  res.status(200).render('login');
});

router.post('/login', async (req, res, next) => {
  const payload = req.body;
  if (req.body.logUsername && req.body.logPassword) {
    const user = await User.findOne({
      $or: [{ username: req.body.logUsername }, { email: req.body.logUsername }]
    }).catch(error => {
      console.log(error);
      payload.errorMessage = 'Something Went Wrong';
      res.status(200).render('login', payload);
    });

    if (user) {
      const result = await bcrypt.compare(req.body.logPassword, user.password);
      if (result === true) {
        req.session.user = user;
        return res.redirect('/');
      }

      payload.errorMessage = 'Invalid Credentials';
      return res.status(200).render('login', payload);
    }

    payload.errorMessage = 'Make sure each field has a valid value.';
    res.status(200).render('login', payload);
  }
});

module.exports = router;
