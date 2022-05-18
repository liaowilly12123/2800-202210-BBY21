'use strict';
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const apiRoutes = require('./api/apiRoutes.js');
const responseMiddleware = require('./middleware/responseMiddleware.js');
const { Server } = require('socket.io');

// Express app
const app = express();

const MONGOOSE_URI =
  process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/COMP2800';
const PORT = process.env.PORT ?? 8000;
const UPLOADS_DIR = './uploads';

async function main() {
  // https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
  }

  await mongoose.connect(MONGOOSE_URI);

  // Socket.io obj
  const io = new Server(server);

  app.use('/css', express.static('./public/css'));
  app.use('/js', express.static('./public/js'));
  app.use('/img', express.static('./public/img'));
  app.use('/uploads', express.static('./uploads'));

  // Set express-session options
  app.use(
    session({
      name: 'tuttoria',
      secret: 'tuttoriasecret',
      saveUninitialized: true,
      resave: false,
    })
  );

  // Utility functions to send responses
  app.use(responseMiddleware);
  // Parse incoming payloads as json
  app.use(express.json());

  app.use('/api', apiRoutes);

  app.get('/', function (req, res) {
    if (req.session.userType) {
      return res.redirect('/profile');
    }
    const doc = fs.readFileSync('./public/html/landing.html', 'utf8');
    return res.send(doc);
  });

  app.get('/signup', function (_, res) {
    const doc = fs.readFileSync('./public/html/signup.html', 'utf8');
    return res.send(doc);
  });

  app.get('/profile', function (req, res) {
    let doc;

    if (req.session.userType === 'admin') {
      doc = fs.readFileSync('./public/html/dashboard.html', 'utf8');
    } else {
      doc = fs.readFileSync('./public/html/profile.html', 'utf8');
    }
    return res.send(doc);
  });

  app.get('/tutors', function (_, res) {
    let doc = fs.readFileSync('./public/html/tutors.html', 'utf8');
    return res.send(doc);
  });

  app.get('/chat', function (_, res) {
    let doc = fs.readFileSync('./public/html/chat.html', 'utf8');
    return res.send(doc);
  });

  app.get('/template/nav', function (_, res) {
    const doc = fs.readFileSync('./public/html/template/nav.html', 'utf8');
    return res.send(doc);
  });

  io.on('connection', (socket) => {
    io.emit('connection', `Someone connected ${socket.id}`);

    socket.on('send-message', (msg, room) => {
      io.to(room).emit('msg', msg, socket.id);
    });

    socket.on('join-room', (room) => {
      socket.join(room);
    });
  });
}

const server = app.listen(PORT, main);
