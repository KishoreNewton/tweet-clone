const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const middleware = require('../middleware');
const Chat = require('../schemas/Chat');
const User = require('../schemas/User');

router.get('/notifications', middleware.requireLogin, (req, res) => {
  res.status(200).render('noitificationsPage', {
    pageTitle: 'Notifications',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  });
});

module.exports = router;
