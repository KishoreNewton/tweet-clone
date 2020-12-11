const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/User');

router.get('/messages', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Inbox',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  };

  res.status(200).render('inboxPage', payload);
});

router.get('/messages/new', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'New Message',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  };

  res.status(200).render('newMessages', payload);
});

module.exports = router;
