const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/User');

// FUNCTION FOR GET REQUEST

async function getPayload(username, userLoggedIn) {
  const user = await User.findOne({ username });

  if (!user) {
    const userById = await User.findById(username);

    if (!userById) {
      return {
        pageTitle: 'User Not Found',
        userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn)
      };
    }

    return {
      pageTitle: user.username,
      userLoggedIn,
      userLoggedInJs: JSON.stringify(userLoggedIn),
      profileUser: user
    };
  }
}

// GET REQUEST
router.get('/profile', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: req.session.user.username,
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    profileUser: req.session.user
  };

  res.status(200).render('profilePage', payload);
});

router.get('/profile/:username', middleware.requireLogin, async (req, res, next) => {
  const payload = await getPayload(req.params.username, req.session.user);

  res.status(200).render('profilePage', payload);
});

module.exports = router;
