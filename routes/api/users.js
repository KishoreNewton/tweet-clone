const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const User = require('../../schemas/User');
const middleware = require('../../middleware');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// GET REQUESTS
router.get('/api/users/', middleware.requireLogin, async (req, res, next) => {
  let searchObj = req.query;

  if (req.query.search !== undefined) {
    searchObj = {
      $or: [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { username: { $regex: req.query.search, $options: 'i' } }
      ]
    };
  }

  await User.find(searchObj)
    .then(results => {
      res.status(200).send(results);
    })
    .catch(err => {
      res.sendStatus(400);
    });
});

router.get('/api/users/:userId/followers', middleware.requireLogin, async (req, res, next) => {
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

// POST REQUEST
router.post(
  '/api/users/profilePicture',
  middleware.requireLogin,
  upload.single('croppedImage'),
  async (req, res, next) => {
    if (!req.file) {
      console.log('No file uploaded with request');
      return res.sendStatus(400);
    }

    const filePath = `/uploads/images/${req.file.filename}.png`;
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async err => {
      if (err) return res.sendStatus(400);

      req.session.user = await User.findByIdAndUpdate(
        req.session.user._id,
        { profilePic: filePath },
        { new: true }
      );
      res.sendStatus(204);
    });
  }
);

// POST REQUEST
router.post(
  '/api/users/coverPhoto',
  middleware.requireLogin,
  upload.single('croppedImage'),
  async (req, res, next) => {
    if (!req.file) {
      console.log('No file uploaded with request');
      return res.sendStatus(400);
    }

    const filePath = `/uploads/images/${req.file.filename}.png`;
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async err => {
      if (err) return res.sendStatus(400);

      req.session.user = await User.findByIdAndUpdate(
        req.session.user._id,
        { coverPhoto: filePath },
        { new: true }
      );
      res.sendStatus(204);
    });
  }
);

module.exports = router;
