'use strict';
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const apiRoutes = require('./api/apiRoutes.js');
const responseMiddleware = require('./middleware/responseMiddleware.js');
const sanitizeMiddleware = require('./middleware/sanitizeMiddleware.js');
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

  // Parse incoming payloads as json
  app.use(express.json());
  // Utility functions to send responses
  app.use(responseMiddleware);
  // Mongo sanitize to prevent injections
  app.use(sanitizeMiddleware);

  app.use('/api', apiRoutes);

  app.get('/', function (req, res) {
    if (req.session.userType) {
      return res.redirect('/main');
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

  app.get('/template/nav', function (_, res) {
    const doc = fs.readFileSync('./public/html/template/nav.html', 'utf8');
    return res.send(doc);
  });

  app.get('/main', function (req, res) {
    let doc;

    if (!req.session.loggedIn) {
      return res.redirect('/');
    }

    if (req.session.userType === 'admin') {
      doc = fs.readFileSync('./public/html/dashboard.html', 'utf8');
    } else {
      doc = fs.readFileSync('./public/html/main.html', 'utf-8');
    }

    return res.send(doc);
  });
  
  app.get('*', function(req, res){
    const doc = fs.readFileSync('./public/html/error.html', 'utf8');
    res.status(404).send(doc);
  });
}

app.listen(PORT, main);
