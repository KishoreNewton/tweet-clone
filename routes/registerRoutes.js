const express = require('express');
const app = express();
const router = express.Router();

app.set('view engine', 'pug');
app.set('views', 'views');

router.get('/register', (req, res, next) => {
  res.status(200).render('register');
});

router.post('/register', (req, res, next) => {
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password;

  const payload = req.body;

  if(firstName && lastName && username && email && password) {

  } else {
      payload.errorMessage = "Make sure each field is a valid value"
      res.status(422).send('register', payload)
  }
});

module.exports = router;
