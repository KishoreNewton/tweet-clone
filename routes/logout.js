const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../schemas/User');

app.set('view engine', 'pug');
app.set('views', 'views');

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
