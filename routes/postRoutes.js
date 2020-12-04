const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/User');

router.get('/posts/:id', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'View post',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    postId: req.params.id
  };

  res.status(200).render('postPage', payload);
});

module.exports = router;
