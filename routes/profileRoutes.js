const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/User');

// FUNCTION FOR GET REQUEST

async function getPayload(username, userLoggedIn) {
  let user = await User.findOne({ username });

  if (!user) {
    user = await User.findById(username).catch(() => {
      return {
        pageTitle: 'User Not Found',
        userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn)
      };
    });

    if (!user) {
      return {
        pageTitle: 'User Not Found',
        userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn)
      };
    }
  }

  return {
    pageTitle: user.username,
    userLoggedIn,
    userLoggedInJs: JSON.stringify(userLoggedIn),
    profileUser: user
  };
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

router.get('/profile/:username/replies', middleware.requireLogin, async (req, res, next) => {
  const payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = 'replies';
  res.status(200).render('profilePage', payload);
});

router.get('/profile/:username/following', middleware.requireLogin, async (req, res, next) => {
  const payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = 'following';

  res.status(200).render('followersAndFollowing', payload);
});

router.get('/profile/:username/followers', middleware.requireLogin, async (req, res, next) => {
  const payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = 'followers';

  res.status(200).render('followersAndFollowing', payload);
});

module.exports = router;
