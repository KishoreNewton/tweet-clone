const express = require('express');
const router = express.Router();
const Post = require('../../schemas/Post');
const User = require('../../schemas/User');
const middleware = require('../../middleware');

async function getPosts(filter) {
  let results = await Post.find(filter)
    .populate('postedBy')
    .populate('retweetData')
    .populate('replyTo')
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });

  results = await User.populate(results, { path: 'replyTo.postedBy' });
  return await User.populate(results, { path: 'retweetData.postedBy' });
}

// GET REQUESTS

router.get('/api/posts', middleware.requireLogin, async (req, res, next) => {
  let searchObj = req.query;

  if (searchObj.isReply !== undefined) {
    const isReply = searchObj.isReply === 'true';
    searchObj.replyTo = { $exists: isReply };
    delete searchObj.isReply;
  }

  if (searchObj.followingOnly !== undefined) {
    const followingOnly = searchObj.followingOnly === 'true';

    if (followingOnly) {
      const objectIds = [];

      if (!req.session.user.following) {
        req.session.user.following = [];
      }

      req.session.user.following.forEach(user => {
        objectIds.push(user);
      });
      objectIds.push(req.session.user._id);
      searchObj.postedBy = { $in: objectIds };
    }

    delete searchObj.followingOnly;
  }

  const results = await getPosts(searchObj);
  res.status(200).send(results);
});

router.get('/api/posts/:id', middleware.requireLogin, async (req, res, next) => {
  const postId = req.params.id;
  let postData = await getPosts({ _id: postId });
  postData = postData[0];

  let results = {
    postData
  };

  if (postData.replyTo) {
    results.replyTo = postData.replyTo;
  }

  results.replies = await getPosts({ replyTo: postId });

  res.status(200).send(results);
});

// POST REQUESTS

router.post('/api/posts', middleware.requireLogin, (req, res, next) => {
  if (!req.body.content) {
    console.log('content param not sent with request');
    return res.sendStatus(400);
  }

  const postData = {
    content: req.body.content,
    postedBy: req.session.user
  };

  if (req.body.replyTo) {
    postData.replyTo = req.body.replyTo;
  }

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

router.post('/api/posts/:id/retweet', middleware.requireLogin, async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.session.user._id;

  const deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId }).catch(error => {
    console.log(error);
    res.sendStatus(400);
  });

  const option = deletedPost !== null ? '$pull' : '$addToSet';

  let rePost = deletedPost;

  if (rePost === null) {
    rePost = await Post.create({
      postedBy: userId,
      retweetData: postId
    }).catch(error => {
      console.log(error);
      res.sendsStatus(400);
    });
  }

  req.session.user = await User.findByIdAndUpdate(
    userId,
    {
      [option]: {
        retweets: rePost._id
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
        retweetUsers: userId
      }
    },
    {
      new: true
    }
  ).catch(error => {
    console.log(error);
    res.sendStatus(400);
  });

  res.status(200).send(post);
});

// PUT REQUESTS

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

  res.status(200).send(post);
});

router.put('/api/posts/:id', middleware.requireLogin, async (req, res, next) => {
  if (req.body.pinned !== undefined) {
    await Post.updateMany(
      {
        postedBy: req.session.user
      },
      {
        pinned: false
      }
    ).catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
  }

  await Post.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.log(err);
    });
});

// DELETE REQUESTS

router.delete('/api/posts/:id', (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      res.sendStatus(202);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

module.exports = router;
