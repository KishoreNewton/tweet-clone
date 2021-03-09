const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const Message = require('../../schemas/Message');
const Chat = require('../../schemas/Chat');
const User = require('../../schemas/User');
const Notification = require('../../schemas/Notifications');

// GET REQUESTS
router.get('/api/notifications', middleware.requireLogin, async (req, res, next) => {
  return Notification.find({ userTo: req.session.user._id, notificationType: { $ne: 'newMessage' } })
    .populate('userTo')
    .populate('userFrom')
    .sort({ createdAt: -1 })
    .then(results => res.status(200).send(results))
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

module.exports = router;
