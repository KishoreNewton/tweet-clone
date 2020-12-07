const express = require('express');
const router = express.Router();
const Post = require('../../schemas/Post');
const User = require('../../schemas/User');
const middleware = require('../../middleware');

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
