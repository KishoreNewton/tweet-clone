const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const Chat = require('../../schemas/Chat');

// GET REQUESTS

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

module.exports = router;
