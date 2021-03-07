const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const Message = require('../../schemas/Message');
const Chat = require('../../schemas/Chat');

// GET REQUESTS
router.post('/api/messages', middleware.requireLogin, async (req, res, next) => {
  if (!req.body.content || !req.body.chatId) {
    console.log('Invalid data passed into request');
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.session.user._id,
    content: req.body.content,
    chat: req.body.chatId
  };

  Message.create(newMessage)
    .then(async message => {
      message = await message.populate('sender').execPopulate();
      message = await message.populate('chat').execPopulate();

      Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message }).catch(error => console.log(error));

      res.status(201).send(message);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

module.exports = router;
