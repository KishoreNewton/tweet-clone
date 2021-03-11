const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const Notification = require('../../schemas/Notifications');

// GET REQUESTS
router.get('/api/notifications', middleware.requireLogin, async (req, res, next) => {
  let searchObj = { userTo: req.session.user._id, notificationType: { $ne: 'newMessage' } };

  if (req.query.unreadOnly !== undefined && req.query.unreadOnly == 'true') {
    searchObj.opened = false;
  }

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

// PUT REQUESTS
router.put('/api/notifications/:id/markAsOpened', middleware.requireLogin, async (req, res, next) => {
  Notification.findByIdAndUpdate(req.params.id, { opened: true })
    .then(() => res.status(204).send({ working: 'working' }))
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.put('/api/notifications/markAsOpened', middleware.requireLogin, async (req, res, next) => {
  Notification.updateMany({ userTo: req.session.user._id }, { opened: true })
    .then(() => res.status(204).send({ working: 'working' }))
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    });
});

module.exports = router;
