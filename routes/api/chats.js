const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const Chat = require('../../schemas/Chat');
const User = require('../../schemas/User');
const Message = require('../../schemas/Message');

// GET REQUESTS
router.get('/api/chats', middleware.requireLogin, async (req, res, next) => {
  Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } } })
    .populate('users')
    .populate('latestMessage')
    .sort({ updatedAt: -1 })
    .then(async results => {
      if (req.query.unreadOnly !== undefined && req.query.unreadOnly == 'true') {
        results = results.filter(
          r => r.latestMessage && !r.latestMessage.readBy.includes(req.session.user._id)
        );
      }

      const result = await User.populate(results, { path: 'latestMessage.sender' });
      res.status(200).send(result);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.get('/api/chats/:chatId', middleware.requireLogin, async (req, res, next) => {
  Chat.findOne({ _id: req.params.chatId, users: { $elemMatch: { $eq: req.session.user._id } } })
    .populate('users')
    .sort({ updatedAt: -1 })
    .then(results => res.status(200).send(results))
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.get('/api/chats/:chatId/messages', middleware.requireLogin, async (req, res, next) => {
  Message.find({ chat: req.params.chatId })
    .populate('sender')
    .then(results => res.status(200).send(results))
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

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
