const express = require('express');
const router = express.Router();
const Post = require('../../schemas/Post');
const User = require('../../schemas/User');
const middleware = require('../../middleware');

router.get('/api/posts', middleware.requireLogin, async (req, res, next) => {
  await Post.find()
    .populate('postedBy')
    .then(result => res.status(200).send(result))
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.post('/api/posts', middleware.requireLogin, (req, res, next) => {
  if (!req.body.content) {
    console.log(req);
    console.log('content param not sent with request');
    return res.sendStatus(400);
  }

  const postData = {
    content: req.body.content,
    postedBy: req.session.user
  };

  Post.create(postData)
    .then(async newPost => {
      newPost = await User.populate(newPost, { path: 'postedBy' });
      res.status(201).send(newPost);
    })
    .catch(err => {
      console.log(err, 'something went wrong');
      res.sendStatus(400);
    });
});

router.put('/api/posts/:id/like', middleware.requireLogin, (req, res, next) => {
  const postId = req.params.id;
  const userId = req.session.user._id;
  const isLiked = rerq.session.user.likes && req.session.user.likes.includes(postId);
  console.log('Is Liked' + isLiked);
  const option = isLiked ? "$pull" : "$addToSet";
  await User.findByIdAndUpdate(userId, { [option]: { likes: postId } });
});

module.exports = router;
