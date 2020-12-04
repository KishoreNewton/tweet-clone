const express = require('express');
const router = express.Router();
const Post = require('../../schemas/Post');
const User = require('../../schemas/User');
const middleware = require('../../middleware');

async function getPosts(filter) {
  const results = await Post.find(filter)
    .populate('postedBy')
    .populate('retweetData')
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });

  return await User.populate(results, { path: 'retweetData.postedBy' });
}

router.get('/api/posts', middleware.requireLogin, async (req, res, next) => {
  const results = await getPosts({});
  res.status(200).send(results);
});

router.get('/api/posts/:id', middleware.requireLogin, async (req, res, next) => {
  const postId = req.params.id;
  let results = await getPosts({ _id: postId });
  // results = results[0];
  res.status(200).send(results);
});

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

// router.post('/api/posts/:id/deleteTweet', middleware.requireLogin, async (req, res, next) => {
//   const postId = req.params.id;
//   const userId = req.session.user._id;

//   await Post.findOneAndDelete({ postedBy: userId, _id: postId }).catch(error => {
//     console.log(error);
//     res.sendStatus(400);
//   });

//   await Post.findOneAndUpdate(
//     { postedBy: postId },
//     {
//       $pull: {
//         retweetUsers: userId
//       }
//     }
//   ).catch(error => {
//     console.log(error);
//     res.sendStatus(400);
//   });

//   const data = {
//     result: "success"
//   }

//   res.status(200).send(data);
// });

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

module.exports = router;
