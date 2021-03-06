const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const middleware = require('../middleware');
const Chat = require('../schemas/Chat');
const User = require('../schemas/User');

router.get('/messages', middleware.requireLogin, (req, res) => {
  const payload = {
    pageTitle: 'Inbox',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  };

  res.status(200).render('inboxPage', payload);
});

router.get('/messages/new', middleware.requireLogin, (req, res) => {
  const payload = {
    pageTitle: 'New Message',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  };

  res.status(200).render('newMessages', payload);
});

router.get('/messages/:chatId', middleware.requireLogin, async (req, res) => {
  const userId = req.session.user._id;
  const chatId = req.params.chatId;

  const isValidId = mongoose.isValidObjectId(chatId);

  let payload = {
    pageTitle: 'Chat',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  };

  if (!isValidId) {
    payload.errorMessage = 'Chat page does not exists';
    return res.status(200).render('chatPage', payload);
  }

  let chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId } } }).populate('users');
  if (chat == null) {
    const userFound = await User.findById(chatId);

    if (userFound !== null) {
      chat = await getChatByUserId(userFound._id, userId);
    }
  }

  if (chat == null) {
    payload.errorMessage = 'Chat does not exist or you do not have permission to view it.';
  } else {
    payload.chat = chat;
  }

  res.status(200).render('chatPage', payload);
});

function getChatByUserId(userLoggedInId, otherUserId) {
  return Chat.findOneAndUpdate(
    {
      isGroupChat: false,
      users: {
        $size: 2,
        $all: [{ $elemMatch: { $eq: userLoggedInId } }, { $elemMatch: { $eq: otherUserId } }]
      }
    },
    {
      $setOnInsert: {
        users: [userLoggedInId, otherUserId]
      }
    },
    {
      new: true,
      upsert: true
    }
  ).populate('users');
}


module.exports = router;
