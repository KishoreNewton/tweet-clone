const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const Chat = require('../../schemas/Chat');

// GET REQUESTS
router.get('/api/chats', middleware.requireLogin, async (req, res, next) => {
  Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } } })
    .populate('users')
    .sort({ updatedAt: -1 })
    .then(results => {
      res.status(200).send(results);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.get('/api/chats/:chatId')


// POST REQUESTS
router.post('/api/chats', middleware.requireLogin, async (req, res, next) => {
  if (!req.body.users) {
    console.log('Users param not sent with request');
    return res.sendStatus(400);
  }

  const users = JSON.parse(req.body.users);

  if (users.length === 0) {
    console.log('Users array is empty');
    return res.sendStatus(400);
  }

  users.push(req.session.user);

  const chatData = {
    users,
    isGroupChat: true
  };

  Chat.create(chatData)
    .then(results => {
      res.status(200).send(results);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

// PUT REQUESTS
router.put('/api/chats/:chatId', middleware.requireLogin, async (req, res, next) => {
  Chat.findByIdAndUpdate(req.params.chatId, req.body)
    .then(results => res.status(204).send(results))
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

module.exports = router;
