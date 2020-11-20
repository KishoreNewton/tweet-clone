const { Router } = require('express');
const express = require('express');
const app = express();
const router = express.Router();

app.set('view engine', 'pug');
app.set('views', 'views');

router.get('/login', (req, res, next) => {
  res.status(200).render('login');
});

module.exports = router;
