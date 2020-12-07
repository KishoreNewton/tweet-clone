const express = require('express');
const router = express.Router();
const Post = require('../../schemas/Post');
const User = require('../../schemas/User');
const middleware = require('../../middleware');

// GET REQUESTS
router.get('/api/users/:userId/followers', middleware.requireLogin, async (req, res, next) => {
  console.log(req.params.userId);
  await User.findById(req.params.userId)
    .populate('followers')
    .then(results => {
      res.status(200).send(results);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.get('/api/users/:userId/following', middleware.requireLogin, async (req, res, next) => {
  await User.findById(req.params.userId)
    .populate('following')
    .then(results => {
      res.status(200).send(results);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

// PUT REQUESTS
router.put('/api/users/:userId/follow', async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).catch(err => console.error(err));

  if (!user) {
    return res.send(404);
  }

  const isFollowing = user.followers && user.followers.includes(req.session.user._id);
  const option = isFollowing ? '$pull' : '$addToSet';

  req.session.user = await User.findByIdAndUpdate(
    req.session.user._id,
    {
      [option]: {
        following: userId
      }
    },
    {
      new: true
    }
  ).catch(error => {
    console.log(error);
    res.sendStatus(400);
  });

  User.findByIdAndUpdate(userId, { [option]: { followers: req.session.user._id } }).catch(error => {
    res.sendStatus(404);
  });

  res.status(200).send(req.session.user);
});

module.exports = router;
