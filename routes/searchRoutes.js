const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/User');

// function - GET METHOD
function createPayload(req) {
  return {
    pageTitle: 'Search',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  };
}

router.get('/search', middleware.requireLogin, (req, res, next) => {
  const payload = createPayload(req);
  res.status(200).render('searchPage', payload);
});

router.get('/search/:selectedTab', middleware.requireLogin, (req, res, next) => {
  const payload = createPayload(req);
  payload.selectedTab = req.params.selectedTab;
  res.status(200).render('searchPage', payload);
});

module.exports = router;
