const express = require('express');
const app = express();
const router = express.Router();

app.set('view engine', 'pug');
app.set('views', 'views');

router.get('/register', (req, res, next) => {
  res.status(200).render('register');
});

router.post('/register', (req, res, next) => {});

module.exports = router;
