const express = require('express');
const app = express();
const middleware = require('./middleware');
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const searchRoute = require('./routes/searchRoutes');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const messagesRoute = require('./routes/messagesRoutes');
const notificationsRoute = require('./routes/notificationRoutes');
const signoutRoute = require('./routes/logout');
const postsApiRoute = require('./routes/api/posts');
const usersApiRoute = require('./routes/api/users');
const chatsApiRoute = require('./routes/api/chats');
const messageApiRoute = require('./routes/api/messages');
const notificationApiRoute = require('./routes/api/notifications');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { json } = require('body-parser');
require('./database');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
    // cookie: { secure: true } // requires https connection
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  })
);
app.use(
  bodyParser.json({
    limit: '50mb',
    extended: true
  })
);
app.use(express.static('public'));
app.use(loginRoute);
app.use(registerRoute);
app.use(usersApiRoute);
app.use(postRoutes);
app.use(searchRoute);
app.use(messagesRoute);
app.use(notificationsRoute);
app.use(signoutRoute);
app.use(profileRoutes);
app.use(uploadRoutes);
app.use(postsApiRoute);
app.use(chatsApiRoute);
app.use(messageApiRoute);
app.use(notificationApiRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  };

  res.status(200).render('home', payload);
});

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`🎧 Listening on port ${port}`);
});

const io = require('socket.io')(server, { pingTimeout: 6000 });

io.on('connection', socket => {
  socket.on('setup', userData => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join room', room => socket.join(room));
  socket.on('typing', room => socket.in(room).emit('typing'));
  socket.on('stop typing', room => socket.in(room).emit('stop typing'));
  socket.on('new message', newMessage => {
    let chat = newMessage.chat;

    if (!chat.users) return console.log('Chat.users not defined');

    chat.users.forEach(user => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit('message received', newMessage);
    });
  });
});
