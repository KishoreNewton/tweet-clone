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

router.put('/api/posts/:id/like', middleware.requireLogin, async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.session.user._id;
  const isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
  const option = isLiked ? '$pull' : '$addToSet';
  req.session.user = await User.findByIdAndUpdate(
    userId,
    {
      [option]: {
        likes: postId
      }
    },
    {
      new: true
    }
  ).catch(error => {
    console.log(error);
    res.sendStatus(400);
  });

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      [option]: {
        likes: userId
      }
    },
    {
      new: true
    }
  ).catch(error => {
    console.log(error);
    res.sendStatus(400);
  });
  console.log(post)

  res.status(200).send(post);
});

module.exports = router;
